import { validate } from 'class-validator';
import { DataUtilService, SynchronizerService } from 'j2utils';

import { getTableName } from '../../../common/drydock/ts-helpers/tableName';
import { DailyReportsRepository } from '../../../dal/drydock/daily-reports/DailyReportsRepository';
import { VesselsRepository } from '../../../dal/drydock/vessels/VesselsRepository';
import { DailyReportsEntity, DailyReportUpdatesEntity } from '../../../entity/drydock';
import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';
import { CreateDailyReportsDto } from './dtos/CreateDailyReportsDto';
import { JobOrdersUpdatesDto } from './dtos/JobOrdersUpdatesDto';

export class CreateDailyReportsCommand extends Command<CreateDailyReportsDto, void> {
    dailyReportsRepository: DailyReportsRepository;
    uow: UnitOfWork;
    vesselRepository: VesselsRepository;
    dailyReportsTable = getTableName(DailyReportsEntity);
    dailyReportUpdatesTable = getTableName(DailyReportUpdatesEntity);

    constructor() {
        super();

        this.dailyReportsRepository = new DailyReportsRepository();
        this.vesselRepository = new VesselsRepository();
        this.uow = new UnitOfWork();
    }

    protected async AuthorizationHandlerAsync(): Promise<void> {
        return;
    }

    protected async ValidationHandlerAsync(request: CreateDailyReportsDto): Promise<void> {
        if (!request) {
            throw new Error('Request is null');
        }
        const result = await validate(request);
        if (result.length) {
            throw result;
        }
    }

    protected async MainHandlerAsync(request: CreateDailyReportsDto): Promise<void> {
        const vessel = await this.vesselRepository.GetVesselByProjectUid(request.ProjectUid);
        const { JobOrdersUpdate: JobOrdersUpdate } = request;

        return this.uow.ExecuteAsync(async (queryRunner) => {
            const dailyReportsData = await this.dailyReportsRepository.createDailyReport(request, queryRunner);
            const data = JobOrdersUpdate.map((item: JobOrdersUpdatesDto) => {
                return {
                    uid: DataUtilService.newUid(),
                    ReportUid: dailyReportsData.uid,
                    ReportUpdateName: item.name,
                    SpecificationUid: item.specificationUid,
                    Status: item.status,
                    Progress: item.progress,
                    Remark: item.remark,
                    active_status: true,
                    created_by: request.CreatedBy,
                    created_at: new Date(),
                    // the frontend works in the way that potentially, the user can update the daily report update
                    // entity right during creation of the daily report, so we set this field too
                    updated_by: request.CreatedBy,
                    updated_at: new Date(),
                };
            });
            await this.dailyReportsRepository.createDailyReportUpdate(data, queryRunner);

            await SynchronizerService.dataSynchronizeManager(
                queryRunner.manager,
                this.dailyReportsTable,
                'uid',
                dailyReportsData.uid,
                vessel.VesselId,
            );

            const condition = `uid IN ('${data.map((i: { uid: string }) => i.uid).join(`','`)}')`;
            await SynchronizerService.dataSynchronizeByConditionManager(
                queryRunner.manager,
                this.dailyReportUpdatesTable,
                vessel.VesselId,
                condition,
            );
        });
    }
}
