import { Request } from 'express';
import { AccessRights } from 'j2utils';

import { YardsProjectsRepository } from '../../../dal/drydock/project-yards/YardsProjectsRepository';
import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';

export class CreateYardProjectsCommand extends Command<Request, void> {
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
        if (!request) {
            throw new Error('Request is null');
        }
    }

    protected async MainHandlerAsync(request: Request): Promise<void> {
        //todo: const { UserUID: createdBy } = AccessRights.authorizationDecode(request);

        await this.uow.ExecuteAsync(async (queryRunner) => {
            const createdYardProject = await this.yardProjectsRepository.create(
                {
                    createdBy: '7EBF2022-5300-4137-8E86-21E9118BCD41',
                    projectUid: request.body.projectUid,
                    yardsUids: request.body.yardsUids,
                },
                queryRunner,
            );
            return createdYardProject;
        });

        return;
    }
}
