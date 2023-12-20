import { validate } from 'class-validator';
import { DataUtilService } from 'j2utils';

import { DailyReportsRepository } from '../../../dal/drydock/daily-reports/DailyReportsRepository';
import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';
import { CreateDailyReportsDto } from './dtos/CreateDailyReportsDto';
import { JobOrdersUpdateDto } from './dtos/JobOrdersUpdateDto';

export class CreateDailyReportsCommand extends Command<CreateDailyReportsDto, void> {
    dailyReportsRepository: DailyReportsRepository;
    uow: UnitOfWork;

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
        return this.uow.ExecuteAsync(async (queryRunner) => {
            const reportdata = await this.dailyReportsRepository.createDailyReport(request, queryRunner);
            const { JobOrdersUpdate } = request;
            const data = JobOrdersUpdate.map((item: JobOrdersUpdateDto) => {
                return {
                    uid: DataUtilService.newUid(),
                    ReportUid: reportdata,
                    ReportUpdateName: item.Name,
                    Remark: item.Remark,
                    active_status: true,
                    created_at: request.CreatedAt,
                };
            });
            await this.dailyReportsRepository.createDailyReportUpdate(data, queryRunner);
        });
    }
}
