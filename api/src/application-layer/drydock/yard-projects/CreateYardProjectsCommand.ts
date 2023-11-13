import { Request } from 'express';
import { AccessRights } from 'j2utils';

import { YardProjectsRepository } from '../../../dal/drydock/yard-projects/YardProjectsRepository';
import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';

export class CreateYardProjectsCommand extends Command<Request, void> {
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

    protected async MainHandlerAsync(request: Request): Promise<void> {
        const { UserUID: createdBy } = AccessRights.authorizationDecode(request);

        await this.uow.ExecuteAsync(async () => {
            const createdYardProject = await this.yardProjectsRepository.createYardProjects({
                createdBy: createdBy,
                projectUid: request.body.projectUid,
                yardUid: request.body.yardUid,
            });
            return createdYardProject;
        });

        return;
    }
}
