import { validate } from 'class-validator';
import { SynchronizerService } from 'j2utils';

import { getTableName } from '../../../common/drydock/ts-helpers/tableName';
import { DailyReportsRepository } from '../../../dal/drydock/daily-reports/DailyReportsRepository';
import { VesselsRepository } from '../../../dal/drydock/vessels/VesselsRepository';
import { DailyReportsEntity } from '../../../entity/drydock';
import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';
import { CreateDailyReportsDto } from './dtos/CreateDailyReportsDto';

export class CreateDailyReportsCommand extends Command<CreateDailyReportsDto, void> {
    dailyReportsRepository: DailyReportsRepository;
    uow: UnitOfWork;
    vesselRepository: VesselsRepository;
    dailyReportsTable = getTableName(DailyReportsEntity);

    constructor() {
        super();

        this.dailyReportsRepository = new DailyReportsRepository();
        this.vesselRepository = new VesselsRepository();
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
        const vessel = await this.vesselRepository.GetVesselByProjectUid(request.ProjectUid);

        return this.uow.ExecuteAsync(async (queryRunner) => {
            const dailyReportsData = await this.dailyReportsRepository.createDailyReport(request, queryRunner);

            await SynchronizerService.dataSynchronizeManager(
                queryRunner.manager,
                this.dailyReportsTable,
                'uid',
                dailyReportsData.uid,
                vessel.VesselId,
            );
        });
    }
}
