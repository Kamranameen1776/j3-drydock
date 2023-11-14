import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Request } from 'express';
import { AccessRights } from 'j2utils';

import { YardsProjectsRepository } from '../../../dal/drydock/project-yards/YardsProjectsRepository';
import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';
import { DeleteProjectYardsDto } from './dtos/DeleteProjectYardsDto';
export class DeleteProjectYardsCommand extends Command<DeleteProjectYardsDto, void> {
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

    protected async ValidationHandlerAsync(request: DeleteProjectYardsDto): Promise<void> {
        const body: DeleteProjectYardsDto = plainToClass(DeleteProjectYardsDto, request);
        const result = await validate(body);
        if (result.length) {
            throw result;
        }
        return;
    }

    protected async MainHandlerAsync(request: DeleteProjectYardsDto) {
        //todo: const { UserUID: deletedBy } = AccessRights.authorizationDecode(request);

        await this.uow.ExecuteAsync(async (queryRunner) => {
            const deletedYardProject = await this.yardProjectsRepository.delete(
                {
                    deletedBy: '7EBF2022-5300-4137-8E86-21E9118BCD41',
                    uid: request.uid,
                },
                queryRunner,
            );
            return deletedYardProject;
        });

        return;
    }
}
