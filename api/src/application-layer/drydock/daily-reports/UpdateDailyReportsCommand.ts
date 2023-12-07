import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { AccessRights } from 'j2utils';

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
        const body: UpdateDailyReportsDto = plainToClass(UpdateDailyReportsDto, data);
        const result = await validate(body);
        if (result.length) {
            throw result;
        }
        return;
    }

    protected async MainHandlerAsync(data: UpdateDailyReportsDto): Promise<void> {
        const { UserUID: updatedBy } = AccessRights.authorizationDecode(data);
        const body: UpdateDailyReportsDto = data;

        await this.uow.ExecuteAsync(async (queryRunner) => {
            await this.dailyReportsRepository.updateDailyReport(
                {
                    uid: body.uid,
                    reportName: body.reportName,
                    description: body.description,
                    updatedBy: updatedBy,
                    updatedAt: new Date(),
                },
                queryRunner,
            );
        });

        return;
    }
}
