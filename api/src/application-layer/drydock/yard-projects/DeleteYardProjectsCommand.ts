import { Request } from 'express';
import { AccessRights } from 'j2utils';

import { YardsProjectsRepository } from '../../../dal/drydock/project-yards/YardsProjectsRepository';
import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';
export class DeleteYardProjectsCommand extends Command<Request, void> {
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

    protected async MainHandlerAsync(request: Request) {
        //todo: const { UserUID: deletedBy } = AccessRights.authorizationDecode(request);
        const uid = request.body.uid;
        await this.uow.ExecuteAsync(async () => {
            const deletedYardProject = await this.yardProjectsRepository.delete(
                uid,
                '7EBF2022-5300-4137-8E86-21E9118BCD41',
            );
            return deletedYardProject;
        });

        return;
    }
}
