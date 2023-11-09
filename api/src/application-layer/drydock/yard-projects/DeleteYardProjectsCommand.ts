import { Request } from 'express';
import { AccessRights } from 'j2utils';

import { YardProjectsRepository } from '../../../dal/drydock/yard-projects/YardProjectsRepository';
import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';
export class DeleteYardProjectsCommand extends Command<Request, void> {
    yardProjectsRepository: YardProjectsRepository;
    uow: UnitOfWork;

    constructor() {
        super();

        this.yardProjectsRepository = new YardProjectsRepository();
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
        const { UserUID: deletedBy } = AccessRights.authorizationDecode(request);
        const uid = request.body.uid;
        await this.uow.ExecuteAsync(async (queryRunner) => {
            const deletedYardProject = await this.yardProjectsRepository.DeleteYardProjects(
                uid,
                deletedBy,
                queryRunner,
            );
            return deletedYardProject;
        });

        return;
    }
}
