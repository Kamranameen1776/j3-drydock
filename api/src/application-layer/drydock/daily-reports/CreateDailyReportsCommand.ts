import { validate } from 'class-validator';
import { DataUtilService, SynchronizerService } from 'j2utils';

import { DailyReportsRepository } from '../../../dal/drydock/daily-reports/DailyReportsRepository';
import { VesselsRepository } from '../../../dal/drydock/vessels/VesselsRepository';
import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';
import { CreateDailyReportsDto } from './dtos/CreateDailyReportsDto';
import { JobOrdersUpdatesDto } from './dtos/JobOrdersUpdatesDto';

export class CreateDailyReportsCommand extends Command<CreateDailyReportsDto, void> {
    dailyReportsRepository: DailyReportsRepository;
    uow: UnitOfWork;
    vesselRepository: VesselsRepository;
    dailyReportsTable = 'dry_dock.daily_reports';
    dailyReportUpdatesTable = 'dry_dock.daily_report_updates';

    constructor() {
        super();

        this.dailyReportsRepository = new DailyReportsRepository();
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
        return this.uow.ExecuteAsync(async (queryRunner) => {
            const dailyReportsdata = await this.dailyReportsRepository.createDailyReport(request, queryRunner);
            const { JobOrdersUpdate } = request;
            const data = JobOrdersUpdate.map((item: JobOrdersUpdatesDto) => {
                return {
                    uid: DataUtilService.newUid(),
                    ReportUid: dailyReportsdata.uid,
                    ReportUpdateName: item.Name,
                    Remark: item.Remark,
                    active_status: true,
                    created_at: request.CreatedAt,
                };
            });
            const dailyReportUpdatesData = await this.dailyReportsRepository.createDailyReportUpdate(data, queryRunner);
            await SynchronizerService.dataSynchronizeByConditionManager(
                queryRunner.manager,
                this.dailyReportsTable,
                vessel.VesselId,
                dailyReportsdata.uid,
            );
            dailyReportUpdatesData.identifiers.map((item) => {
                SynchronizerService.dataSynchronizeByConditionManager(
                    queryRunner.manager,
                    this.dailyReportUpdatesTable,
                    vessel.VesselId,
                    item.uid,
                );
            });
        });
    }
}
