import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { SynchronizerService } from 'j2utils';

import { getTableName } from '../../../../common/drydock/ts-helpers/tableName';
import { YardsProjectsRepository } from '../../../../dal/drydock/project-yards/YardsProjectsRepository';
import { VesselsRepository } from '../../../../dal/drydock/vessels/VesselsRepository';
import { YardsProjectsEntity } from '../../../../entity/drydock';
import { Command } from '../../core/cqrs/Command';
import { UnitOfWork } from '../../core/uof/UnitOfWork';
import { CreateProjectYardsDto } from './dtos/CreateProjectYardsDto';

export class CreateProjectYardsCommand extends Command<CreateProjectYardsDto, void> {
    yardProjectsRepository: YardsProjectsRepository;
    uow: UnitOfWork;
    vesselRepository: VesselsRepository;
    tableName = getTableName(YardsProjectsEntity);

    constructor() {
        super();

        this.yardProjectsRepository = new YardsProjectsRepository();
        this.uow = new UnitOfWork();
        this.vesselRepository = new VesselsRepository();
    }

    protected async AuthorizationHandlerAsync(): Promise<void> {
        return;
    }

    protected async ValidationHandlerAsync(request: CreateProjectYardsDto): Promise<void> {
        const body: CreateProjectYardsDto = plainToClass(CreateProjectYardsDto, request);

        const result = await validate(body);

        if (result.length) {
            throw result;
        }

        return;
    }

    protected async MainHandlerAsync(request: CreateProjectYardsDto): Promise<void> {
        const vessel = await this.vesselRepository.GetVesselByProjectUid(request.projectUid);

        await this.uow.ExecuteAsync(async (queryRunner) => {
            const uids = await this.yardProjectsRepository.create(
                {
                    createdBy: request.createdBy,
                    projectUid: request.projectUid,
                    yardsUids: request.yardsUids,
                    createdAt: new Date(),
                },
                queryRunner,
            );
            const condition = `uid IN ('${uids.join(`','`)}')`;
            await SynchronizerService.dataSynchronizeByConditionManager(
                queryRunner.manager,
                this.tableName,
                vessel.VesselId,
                condition,
            );
        });

        return;
    }
}
