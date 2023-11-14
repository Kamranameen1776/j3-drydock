import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { AccessRights } from 'j2utils';

import { YardsProjectsRepository } from '../../../dal/drydock/project-yards/YardsProjectsRepository';
import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';
import { UpdateProjectYardsDto } from './dtos/UpdateProjectYardsDto';

export class UpdateProjectYardsCommand extends Command<UpdateProjectYardsDto, void> {
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

    protected async ValidationHandlerAsync(request: UpdateProjectYardsDto): Promise<void> {
        const body: UpdateProjectYardsDto = plainToClass(UpdateProjectYardsDto, request);
        const result = await validate(body);
        if (result.length) {
            throw result;
        }
        return;
    }

    protected async MainHandlerAsync(request: UpdateProjectYardsDto): Promise<void> {
        await this.uow.ExecuteAsync(async (queryRunner) => {
            const projectId = await this.yardProjectsRepository.update(request, queryRunner);
            return projectId;
        });

        return;
    }
}
