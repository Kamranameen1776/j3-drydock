import { validate } from 'class-validator';
import { DataUtilService, SynchronizerService } from 'j2utils';

import { getTableName } from '../../../common/drydock/ts-helpers/tableName';
import { DailyReportsRepository } from '../../../dal/drydock/daily-reports/DailyReportsRepository';
import { VesselsRepository } from '../../../dal/drydock/vessels/VesselsRepository';
import { DailyReportsEntity } from '../../../entity/drydock';
import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';
import { JobOrdersUpdatesDto } from './dtos/JobOrdersUpdatesDto';
import { UpdateDailyReportsDto } from './dtos/UpdateDailyReportsDto';

export class UpdateDailyReportsCommand extends Command<UpdateDailyReportsDto, void> {
    dailyReportsRepository: DailyReportsRepository;
    uow: UnitOfWork;
    vesselRepository: VesselsRepository;
    dailyReportsTable = getTableName(DailyReportsEntity);

    constructor() {
        super();

        this.dailyReportsRepository = new DailyReportsRepository();
        this.vesselRepository = new VesselsRepository();
        this.uow = new UnitOfWork();
    }

    protected async AuthorizationHandlerAsync(): Promise<void> {
        return;
    }

    protected async ValidationHandlerAsync(data: UpdateDailyReportsDto): Promise<void> {
        if (!data) {
            throw new Error('Request is null');
        }
        const result = await validate(data);
        if (result.length) {
            throw result;
        }
    }

    protected async MainHandlerAsync(data: UpdateDailyReportsDto): Promise<void> {
        const vessel = await this.vesselRepository.GetVesselByProjectUid(data.ProjectUid);
        await this.uow.ExecuteAsync(async (queryRunner) => {
            const reportDetails = await this.dailyReportsRepository.findOneByDailyReportUid(data.DailyReportUid);
            await this.dailyReportsRepository.updateDailyReport(
                {
                    DailyReportUid: data.DailyReportUid,
                    ReportName: data.ReportName,
                    UserUid: data.UserUid,
                    UpdatedAt: new Date(),
                },
                queryRunner,
            );
            await this.dailyReportsRepository.deleteDailyReportUpdates(
                {
                    ReportUid: data.DailyReportUid,
                    UserUid: data.UserUid,
                    DeletedAt: new Date(),
                },
                queryRunner,
            );
            const newUpdates = data.JobOrdersUpdate.map((item: JobOrdersUpdatesDto) => {
                return {
                    uid: DataUtilService.newUid(),
                    ReportUid: data.DailyReportUid,
                    ReportUpdateName: item.name,
                    SpecificationUid: item.specificationUid,
                    Status: item.status,
                    Progress: item.progress,
                    Remark: item.remark,
                    active_status: true,
                    created_by: reportDetails.createdBy,
                    created_at: reportDetails.createdAt,
                    updated_by: data.UserUid,
                    updated_at: new Date(),
                };
            });
            await this.dailyReportsRepository.createDailyReportUpdate(newUpdates, queryRunner);

            await SynchronizerService.dataSynchronizeManager(
                queryRunner.manager,
                this.dailyReportsTable,
                'uid',
                data.DailyReportUid,
                vessel.VesselId,
            );
        });

        return;
    }
}
