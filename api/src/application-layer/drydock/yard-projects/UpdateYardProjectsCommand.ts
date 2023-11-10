import { YardProjectsRepository } from '../../../dal/drydock/yard-projects/YardProjectsRepository';
import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';
import { UpdateYardProjectsDto } from './dtos/UpdateYardProjectsDto';

export class UpdateYardProjectsCommand extends Command<UpdateYardProjectsDto, void> {
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

    protected async ValidationHandlerAsync(request: UpdateYardProjectsDto): Promise<void> {
        if (!request) {
            throw new Error('Request is null');
        }
    }

    protected async MainHandlerAsync(request: UpdateYardProjectsDto): Promise<void> {
        await this.uow.ExecuteAsync(async (queryRunner) => {
            const updatedYardProjectsData = await this.yardProjectsRepository.updateYardProjects(request, queryRunner);
            return updatedYardProjectsData;
        });

        return;
    }
}
