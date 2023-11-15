import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Request } from 'express';
import { AccessRights } from 'j2utils';

import { BusinessException } from '../../../../bll/drydock/core/exceptions/BusinessException';
import { YardsProjectsRepository } from '../../../../dal/drydock/project-yards/YardsProjectsRepository';
import { Command } from '../../core/cqrs/Command';
import { UnitOfWork } from '../../core/uof/UnitOfWork';
import { UpdateProjectYardsDto } from './dtos/UpdateProjectYardsDto';

export class UpdateProjectYardsCommand extends Command<Request, void> {
    yardProjectsRepository: YardsProjectsRepository;
    uow: UnitOfWork;

    constructor() {
        super();

        this.yardProjectsRepository = new YardsProjectsRepository();
        this.uow = new UnitOfWork();
    }

    protected async AuthorizationHandlerAsync(): Promise<void> {
        return;
    }

    protected async ValidationHandlerAsync(request: Request): Promise<void> {
        const body: UpdateProjectYardsDto = plainToClass(UpdateProjectYardsDto, request.body);
        const result = await validate(body);
        if (result.length) {
            throw result;
        }

        const yardProject = await this.yardProjectsRepository.get(body.uid);
        if (!yardProject || yardProject.activeStatus === false) {
            throw new BusinessException(
                `The project yard identified by UID: ${body.uid} could not be found or has been deleted.`,
            );
        }

        if (body.isSelected) {
            const yardsProjects = await this.yardProjectsRepository.getAllByProject(yardProject.projectUid);
            if (!yardsProjects || yardsProjects.some((yardProject) => yardProject.isSelected)) {
                throw new BusinessException(
                    `Multiple yard selection for the same project ${yardProject.projectUid} is not allowed.`,
                );
            }
        }
        return;
    }

    protected async MainHandlerAsync(request: Request): Promise<void> {
        const { UserUID: updatedBy } = AccessRights.authorizationDecode(request);
        const body: UpdateProjectYardsDto = request.body;

        await this.uow.ExecuteAsync(async (queryRunner) => {
            await this.yardProjectsRepository.update(
                {
                    updatedBy: updatedBy,
                    isSelected: body.isSelected,
                    lastExportedDate: body.lastExportedDate,
                    uid: body.uid,
                    updatedAt: new Date(),
                },
                queryRunner,
            );
        });

        return;
    }
}
