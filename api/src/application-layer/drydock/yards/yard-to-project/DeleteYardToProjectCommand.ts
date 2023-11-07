import { YardToProjectRepository } from '../../../../dal/drydock/yards/yard-to-project/YardToProjectRepository';
import { Command } from '../../core/cqrs/Command';
import { UnitOfWork } from '../../core/uof/UnitOfWork';
import { DeleteYardToProjectDto } from './dtos/DeleteYardToProjectDto';

export class DeleteYardToProjectCommand extends Command<DeleteYardToProjectDto, void> {
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

    protected async ValidationHandlerAsync(request: DeleteYardToProjectDto): Promise<void> {
        if (!request) {
            throw new Error('Request is null');
        }
    }

    protected async MainHandlerAsync(request: DeleteYardToProjectDto) {
        await this.uow.ExecuteAsync(async (queryRunner) => {
            const updatedSpecData = await this.yardToProjectRepository.DeleteYardToProject(request.uid, queryRunner);
            return updatedSpecData;
        });

        return;
    }
}
