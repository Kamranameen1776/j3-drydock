import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
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

    protected async ValidationHandlerAsync(request: Request): Promise<void> {
        if (!request) {
            throw new Error('Request is null');
        }
        const deleteStatementOfFacts: DeleteDailyReportsDto = plainToClass(DeleteDailyReportsDto, request);
        const result = await validate(deleteStatementOfFacts);
        if (result.length) {
            throw result;
        }
    }

    protected async MainHandlerAsync(request: Request) {
        const { UserUID: deletedBy } = AccessRights.authorizationDecode(request);
        const body: DeleteDailyReportsDto = request.body;

        await this.uow.ExecuteAsync(async (queryRunner) => {
            await this.dailyReportsRepository.delete(
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
