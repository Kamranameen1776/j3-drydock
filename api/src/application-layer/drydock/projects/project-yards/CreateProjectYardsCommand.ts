import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Request } from 'express';
import { AccessRights, SynchronizerService } from 'j2utils';

import { YardsProjectsRepository } from '../../../../dal/drydock/project-yards/YardsProjectsRepository';
import { VesselsRepository } from '../../../../dal/drydock/vessels/VesselsRepository';
import { Command } from '../../core/cqrs/Command';
import { UnitOfWork } from '../../core/uof/UnitOfWork';
import { CreateProjectYardsDto } from './dtos/CreateProjectYardsDto';

export class CreateProjectYardsCommand extends Command<Request, void> {
    yardProjectsRepository: YardsProjectsRepository;
    uow: UnitOfWork;
    vesselRepository: VesselsRepository;
    tableName = 'dry_dock.yards_projects';

    constructor() {
        super();

        this.yardProjectsRepository = new YardsProjectsRepository();
        this.uow = new UnitOfWork();
        this.vesselRepository = new VesselsRepository();
    }

    protected async AuthorizationHandlerAsync(): Promise<void> {
        return;
    }

    protected async ValidationHandlerAsync(request: Request): Promise<void> {
        const body: CreateProjectYardsDto = plainToClass(CreateProjectYardsDto, request.body);
        const result = await validate(body);
        if (result.length) {
            throw result;
        }
        return;
    }

    protected async MainHandlerAsync(request: Request): Promise<void> {
        const { UserUID: createdBy } = AccessRights.authorizationDecode(request);
        const body: CreateProjectYardsDto = request.body;
        const vessel = await this.vesselRepository.GetVesselByProjectUid(body.projectUid);

        await this.uow.ExecuteAsync(async (queryRunner) => {
            const uids = await this.yardProjectsRepository.create(
                {
                    createdBy: createdBy,
                    projectUid: body.projectUid,
                    yardsUids: body.yardsUids,
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
