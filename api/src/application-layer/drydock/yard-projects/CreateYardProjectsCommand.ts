import { YardProjectsRepository } from '../../../dal/drydock/yard-projects/YardProjectsRepository';
import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';
import { CreateYardProjectsDto } from './dtos/CreateYardProjectsDto';

export class CreateYardProjectsCommand extends Command<CreateYardProjectsDto, void> {
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

    protected async ValidationHandlerAsync(request: CreateYardProjectsDto): Promise<void> {
        if (!request) {
            throw new Error('Request is null');
        }
    }

    protected async MainHandlerAsync(request: CreateYardProjectsDto): Promise<void> {
        await this.uow.ExecuteAsync(async (queryRunner) => {
            const createdYardProjects = await this.yardProjectsRepository.CreateYardProjects(request, queryRunner);
            return createdYardProjects;
        });

        return;
    }
}
