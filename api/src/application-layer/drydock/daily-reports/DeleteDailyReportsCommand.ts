import { Request } from 'express';
import { AccessRights } from 'j2utils';

import { DailyReportsRepository } from '../../../dal/drydock/daily-reports/DailyReportsRepository';
import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';
import { DeleteDailyReportsDto } from './dtos/DeleteDailyReportsDto';

export class DeleteDailyReportsCommand extends Command<Request, void> {
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

    protected async ValidationHandlerAsync(data: Request): Promise<void> {
        if (!data) {
            throw new Error('Request is null');
        }
    }

    protected async MainHandlerAsync(data: Request) {
        const { UserUID: deletedBy } = AccessRights.authorizationDecode(data);
        const body: DeleteDailyReportsDto = data.body;

        await this.uow.ExecuteAsync(async (queryRunner) => {
            await this.dailyReportsRepository.deleteDailyReport(
                {
                    deletedBy: deletedBy,
                    uid: body.uid,
                    deletedAt: new Date(),
                },
                queryRunner,
            );
        });

        return;
    }
}
