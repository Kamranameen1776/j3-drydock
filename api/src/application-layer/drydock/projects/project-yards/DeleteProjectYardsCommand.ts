import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { AccessRights } from 'j2utils';

import { YardsProjectsRepository } from '../../../../dal/drydock/project-yards/YardsProjectsRepository';
import { Command } from '../../core/cqrs/Command';
import { UnitOfWork } from '../../core/uof/UnitOfWork';
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
        //const { UserUID: deletedBy } = AccessRights.authorizationDecode(request);

        await this.uow.ExecuteAsync(async (queryRunner) => {
            const deletedYardProject = await this.yardProjectsRepository.delete(
                {
                    deletedBy: '1FE9AE21-A28A-434B-8797-E7BCFA5328EC',
                    uid: request.uid,
                    deletedAt: new Date(),
                },
                queryRunner,
            );
            return deletedYardProject;
        });

        return;
    }
}
