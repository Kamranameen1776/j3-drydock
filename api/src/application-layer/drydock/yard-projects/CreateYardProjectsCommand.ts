import { Request } from 'express';
import { AccessRights } from 'j2utils';

import { YardProjectsRepository } from '../../../dal/drydock/yard-projects/YardProjectsRepository';
import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';
import { CreateYardProjectsDto } from './dtos/CreateYardProjectsDto';

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
        const body: CreateYardProjectsDto = request.body;
        const yardUid = request.body.yardUid;
        for (let i = 0; i < yardUid?.length; i++) {
            await this.uow.ExecuteAsync(async (queryRunner) => {
                const createdYardProject = await this.yardProjectsRepository.CreateYardProjects(
                    yardUid[i],
                    body,
                    createdBy,
                    queryRunner,
                );
                return createdYardProject;
            });
        }
        return;
    }
}
