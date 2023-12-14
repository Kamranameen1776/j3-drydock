import { validate } from 'class-validator';

import { DailyReportsRepository } from '../../../dal/drydock/daily-reports/DailyReportsRepository';
import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';
import { UpdateDailyReportsDto } from './dtos/UpdateDailyReportsDto';

export class UpdateDailyReportsCommand extends Command<UpdateDailyReportsDto, void> {
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
        await this.uow.ExecuteAsync(async (queryRunner) => {
            await this.dailyReportsRepository.updateDailyReport(
                {
                    DailyReportUid: data.DailyReportUid,
                    ReportName: data.ReportName,
                    Description: data.Description,
                    UserUid: data.UserUid,
                    UpdatedAt: data.UpdatedAt,
                },
                queryRunner,
            );
        });

        return;
    }
}
