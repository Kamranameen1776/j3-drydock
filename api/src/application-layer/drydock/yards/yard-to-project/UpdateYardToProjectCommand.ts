import { YardToProjectRepository } from '../../../../dal/drydock/yards/yard-to-project/YardToProjectRepository';
import { Command } from '../../core/cqrs/Command';
import { UnitOfWork } from '../../core/uof/UnitOfWork';
import { UpdateYardToProjectDto } from './dtos/UpdateYardToProjectDto';

export class UpdateYardToProjectCommand extends Command<UpdateYardToProjectDto, void> {
    yardToProjectRepository: YardToProjectRepository;
    uow: UnitOfWork;

    constructor() {
        super();

        this.yardToProjectRepository = new YardToProjectRepository();
        this.uow = new UnitOfWork();
    }

    protected async AuthorizationHandlerAsync(): Promise<void> {
        return;
    }

    protected async ValidationHandlerAsync(request: UpdateYardToProjectDto): Promise<void> {
        if (!request) {
            throw new Error('Request is null');
        }
    }

    protected async MainHandlerAsync(request: UpdateYardToProjectDto): Promise<void> {
        await this.uow.ExecuteAsync(async (queryRunner) => {
            const updatedSpecData = await this.yardToProjectRepository.UpdateYardToProject(request, queryRunner);
            return updatedSpecData;
        });

        return;
    }
}
