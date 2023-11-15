import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Request } from 'express';
import { AccessRights } from 'j2utils';

import { YardsProjectsRepository } from '../../../../dal/drydock/project-yards/YardsProjectsRepository';
import { Command } from '../../core/cqrs/Command';
import { UnitOfWork } from '../../core/uof/UnitOfWork';
import { DeleteProjectYardsDto } from './dtos/DeleteProjectYardsDto';
export class DeleteProjectYardsCommand extends Command<Request, void> {
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
        const body: DeleteProjectYardsDto = plainToClass(DeleteProjectYardsDto, request.body);
        const result = await validate(body);
        if (result.length) {
            throw result;
        }
        return;
    }

    protected async MainHandlerAsync(request: Request) {
        const { UserUID: deletedBy } = AccessRights.authorizationDecode(request);
        const body: DeleteProjectYardsDto = request.body;

        await this.uow.ExecuteAsync(async (queryRunner) => {
            const deletedYardProject = await this.yardProjectsRepository.delete(
                {
                    deletedBy: deletedBy,
                    uid: body.uid,
                    deletedAt: new Date(),
                },
                queryRunner,
            );
            return deletedYardProject;
        });

        return;
    }
}
