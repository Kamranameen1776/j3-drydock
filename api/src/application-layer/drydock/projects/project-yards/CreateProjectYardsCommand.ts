import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Request } from 'express';
import { AccessRights } from 'j2utils';

import { YardsProjectsRepository } from '../../../../dal/drydock/project-yards/YardsProjectsRepository';
import { Command } from '../../core/cqrs/Command';
import { UnitOfWork } from '../../core/uof/UnitOfWork';
import { CreateProjectYardsDto } from './dtos/CreateProjectYardsDto';

export class CreateProjectYardsCommand extends Command<Request, void> {
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
        const body: CreateProjectYardsDto = plainToClass(CreateProjectYardsDto, request.body);
        const result = await validate(body);
        if (result.length) {
            throw result;
        }
        return;
    }

    protected async MainHandlerAsync(request: Request): Promise<void> {
        const { UserUID: createdBy } = AccessRights.authorizationDecode(request);
        const body: CreateProjectYardsDto = request.body;

        await this.uow.ExecuteAsync(async (queryRunner) => {
            await this.yardProjectsRepository.create(
                {
                    createdBy: createdBy,
                    projectUid: body.projectUid,
                    yardsUids: body.yardsUids,
                    createdAt: new Date(),
                },
                queryRunner,
            );
        });

        return;
    }
}
