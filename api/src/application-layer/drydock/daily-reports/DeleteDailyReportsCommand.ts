import { validate } from 'class-validator';
import { SynchronizerService } from 'j2utils';

import { getTableName } from '../../../common/drydock/ts-helpers/tableName';
import { DailyReportsRepository } from '../../../dal/drydock/daily-reports/DailyReportsRepository';
import { VesselsRepository } from '../../../dal/drydock/vessels/VesselsRepository';
import { DailyReportsEntity } from '../../../entity/drydock';
import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';
import { DeleteDailyReportsDto } from './dtos/DeleteDailyReportsDto';

export class DeleteDailyReportsCommand extends Command<DeleteDailyReportsDto, void> {
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
        const vessel = await this.vesselRepository.GetVesselByProjectUid(data.ProjectUid);
        await this.uow.ExecuteAsync(async (queryRunner) => {
            await this.dailyReportsRepository.deleteDailyReport(
                {
                    DailyReportUid: data.DailyReportUid,
                    UserUid: data.UserUid,
                    DeletedAt: new Date(),
                },
                queryRunner,
            );

            await SynchronizerService.dataSynchronizeManager(
                queryRunner.manager,
                this.dailyReportsTable,
                'uid',
                data.DailyReportUid,
                vessel.VesselId,
            );
        });

        return;
    }
}
