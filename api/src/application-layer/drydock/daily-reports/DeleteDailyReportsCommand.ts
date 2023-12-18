import { validate } from 'class-validator';

import { DailyReportsRepository } from '../../../dal/drydock/daily-reports/DailyReportsRepository';
import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';
import { DeleteDailyReportsDto } from './dtos/DeleteDailyReportsDto';

export class DeleteDailyReportsCommand extends Command<DeleteDailyReportsDto, void> {
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

    protected async ValidationHandlerAsync(data: DeleteDailyReportsDto): Promise<void> {
        if (!data) {
            throw new Error('Request is null');
        }
        const result = await validate(data);
        if (result.length) {
            throw result;
        }
    }

    protected async MainHandlerAsync(data: DeleteDailyReportsDto) {
        await this.uow.ExecuteAsync(async (queryRunner) => {
            await this.dailyReportsRepository.deleteDailyReport(
                {
                    DailyReportUid: data.DailyReportUid,
                    UserUid: data.UserUid,
                    DeletedAt: data.DeletedAt,
                },
                queryRunner,
            );
        });

        return;
    }
}
