import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Request } from 'express';
import { AccessRights } from 'j2utils';

import { DailyReportsRepository } from '../../../dal/drydock/daily-reports/DailyReportsRepository';
import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';
import { CreateDailyReportsDto } from './dtos/CreateDailyReportsDto';

export class CreateDailyReportsCommand extends Command<Request, void> {
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
        const createDailyReportsDto: CreateDailyReportsDto = plainToClass(CreateDailyReportsDto, request.body);
        const result = await validate(createDailyReportsDto);
        if (result.length) {
            throw result;
        }
    }

    protected async MainHandlerAsync(data: Request): Promise<void> {
        const { UserUID: createdBy } = AccessRights.authorizationDecode(data);

        await this.uow.ExecuteAsync(async (queryRunner) => {
            await this.dailyReportsRepository.createDailyReport(
                {
                    projectUid: data.body.projectUid,
                    reportName: data.body.reportName,
                    reportDate: new Date(),
                    description: data.body.description,
                    createdBy: createdBy,
                    createdAt: new Date(),
                },
                queryRunner,
            );
        });

        return;
    }
}
