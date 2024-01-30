import { validate } from 'class-validator';
import { SynchronizerService } from 'j2utils';

import { BusinessException } from '../../../../bll/drydock/core/exceptions';
import { getTableName } from '../../../../common/drydock/ts-helpers/tableName';
import { YardsProjectsRepository } from '../../../../dal/drydock/project-yards/YardsProjectsRepository';
import { VesselsRepository } from '../../../../dal/drydock/vessels/VesselsRepository';
import { YardsProjectsEntity } from '../../../../entity/drydock';
import { Command } from '../../core/cqrs/Command';
import { UnitOfWork } from '../../core/uof/UnitOfWork';
import { UpdateProjectYardsDto } from './dtos/UpdateProjectYardsDto';

export class UpdateProjectYardsCommand extends Command<UpdateProjectYardsDto, void> {
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

    protected async ValidationHandlerAsync(request: UpdateProjectYardsDto): Promise<void> {
        const result = await validate(request);

        if (result.length) {
            throw result;
        }

        const yardProject = await this.yardProjectsRepository.get(request.uid);
        if (!yardProject || yardProject.activeStatus === false) {
            throw new BusinessException(
                `The project yard identified by UID: ${request.uid} could not be found or has been deleted.`,
            );
        }

        if (request.isSelected) {
            const yardsProjects = await this.yardProjectsRepository.getAllByProject(yardProject.projectUid);
            if (
                !yardsProjects ||
                yardsProjects.some((yardProject) => yardProject.isSelected && yardProject.uid !== request.uid)
            ) {
                throw new BusinessException(
                    `Multiple yard selection for the same project ${yardProject.projectUid} is not allowed.`,
                );
            }
        }
        return;
    }

    protected async MainHandlerAsync(request: UpdateProjectYardsDto): Promise<void> {
        const yardProject = await this.yardProjectsRepository.get(request.uid);
        const vessel = await this.vesselRepository.GetVesselByProjectUid(yardProject.projectUid);

        await this.uow.ExecuteAsync(async (queryRunner) => {
            await this.yardProjectsRepository.update(
                {
                    updatedBy: request.updatedBy,
                    isSelected: request.isSelected,
                    lastExportedDate: request.lastExportedDate,
                    uid: request.uid,
                    updatedAt: new Date(),
                },
                queryRunner,
            );
            await SynchronizerService.dataSynchronizeManager(
                queryRunner.manager,
                this.tableName,
                'uid',
                request.uid,
                vessel.VesselId,
            );
        });

        return;
    }
}
