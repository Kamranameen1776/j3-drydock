import { validate } from 'class-validator';
import { DataUtilService } from 'j2utils';

import { DailyReportsRepository } from '../../../dal/drydock/daily-reports/DailyReportsRepository';
import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';
import { CreateDailyReportsDto } from './dtos/CreateDailyReportsDto';

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
            if (JobOrdersUpdate.length) {
                const data = JobOrdersUpdate.map((item: any) => {
                    return {
                        uid: DataUtilService.newUid(),
                        ReportUid: reportdata,
                        JobOrdersUpdate: item.Remark,
                        ReportUpdateName: item.ReportUpdateName,
                        ActiveStatus: true,
                    };
                });
                await this.dailyReportsRepository.CreateReportRemark(data, queryRunner);
            }
        });
    }
}
