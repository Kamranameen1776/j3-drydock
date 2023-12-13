import { validate } from 'class-validator';

import { CreateDailyReportsDto } from '../../../controllers/drydock/daily-reports/dtos/CreateDailyReportsDto';
import { DailyReportsRepository } from '../../../dal/drydock/daily-reports/DailyReportsRepository';
import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';

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

    protected async MainHandlerAsync(data: CreateDailyReportsDto): Promise<void> {
        await this.uow.ExecuteAsync(async (queryRunner) => {
            await this.dailyReportsRepository.createDailyReport(
                {
                    projectUid: data.projectUid,
                    reportName: data.reportName,
                    reportDate: data.reportDate,
                    description: data.description,
                    createdBy: data.createdBy,
                    createdAt: data.createdAt,
                },
                queryRunner,
            );
        });

        return;
    }
}
