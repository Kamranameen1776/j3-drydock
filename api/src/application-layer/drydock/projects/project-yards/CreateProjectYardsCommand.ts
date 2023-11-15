import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { AccessRights } from 'j2utils';

import { YardsProjectsRepository } from '../../../../dal/drydock/project-yards/YardsProjectsRepository';
import { Command } from '../../core/cqrs/Command';
import { UnitOfWork } from '../../core/uof/UnitOfWork';
import { CreateProjectYardsDto } from './dtos/CreateProjectYardsDto';

export class CreateProjectYardsCommand extends Command<CreateProjectYardsDto, void> {
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

    protected async ValidationHandlerAsync(request: CreateProjectYardsDto): Promise<void> {
        const body: CreateProjectYardsDto = plainToClass(CreateProjectYardsDto, request);
        const result = await validate(body);
        if (result.length) {
            throw result;
        }
        return;
    }

    protected async MainHandlerAsync(request: CreateProjectYardsDto): Promise<void> {
        const { UserUID: createdBy } = AccessRights.authorizationDecode(request);

        await this.uow.ExecuteAsync(async (queryRunner) => {
            const createdYardProject = await this.yardProjectsRepository.create(
                {
                    createdBy: createdBy,
                    projectUid: request.projectUid,
                    yardsUids: request.yardsUids,
                    createdAt: new Date(),
                },
                queryRunner,
            );
            return createdYardProject;
        });

        return;
    }
}
