import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { AccessRights } from 'j2utils';

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

    protected async ValidationHandlerAsync(data: CreateDailyReportsDto): Promise<void> {
        const body: CreateDailyReportsDto = plainToClass(CreateDailyReportsDto, data);
        const result = await validate(body);
        if (result.length) {
            throw result;
        }
        return;
    }

    protected async MainHandlerAsync(data: CreateDailyReportsDto): Promise<void> {
        const { UserUID: createdBy } = AccessRights.authorizationDecode(data);

        await this.uow.ExecuteAsync(async (queryRunner) => {
            await this.dailyReportsRepository.createDailyReport(
                {
                    reportName: data.reportName,
                    description: data.description,
                    createdBy: createdBy,
                    createdAt: new Date(),
                },
                queryRunner,
            );
        });

        return;
    }
}
