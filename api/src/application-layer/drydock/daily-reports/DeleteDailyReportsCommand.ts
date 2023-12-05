import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Request } from 'express';
import { AccessRights } from 'j2utils';

import { BusinessException } from '../../../bll/drydock/core/exceptions/BusinessException';
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
        const body: DeleteDailyReportsDto = plainToClass(DeleteDailyReportsDto, request.body);
        const result = await validate(body);
        if (result.length) {
            throw result;
        }

        const dailyReport = await this.dailyReportsRepository.get(body.uid);
        if (!dailyReport || dailyReport.activeStatus === false) {
            throw new BusinessException(
                `The daily report identified by UID: ${body.uid} could not be found or has been deleted.`,
            );
        }

        return;
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
