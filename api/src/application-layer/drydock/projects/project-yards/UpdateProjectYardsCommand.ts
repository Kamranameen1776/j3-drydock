import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Request } from 'express';
import { AccessRights } from 'j2utils';

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
        return;
    }

    protected async MainHandlerAsync(request: Request): Promise<void> {
        const { UserUID: updatedBy } = AccessRights.authorizationDecode(request);
        const body: UpdateProjectYardsDto = request.body;

        await this.uow.ExecuteAsync(async (queryRunner) => {
            const projectId = await this.yardProjectsRepository.update(
                {
                    updatedBy: updatedBy,
                    isSelected: body.isSelected,
                    lastExportedDate: body.lastExportedDate,
                    uid: body.uid,
                    updatedAt: new Date(),
                },
                queryRunner,
            );
            return projectId;
        });

        return;
    }
}
