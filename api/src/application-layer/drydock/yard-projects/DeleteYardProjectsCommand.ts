import { YardProjectsRepository } from '../../../dal/drydock/yard-projects/YardProjectsRepository';
import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';
import { DeleteYardProjectsDto } from './dtos/DeleteYardProjectsDto';

export class DeleteYardProjectsCommand extends Command<DeleteYardProjectsDto, void> {
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

    protected async ValidationHandlerAsync(request: DeleteYardProjectsDto): Promise<void> {
        if (!request) {
            throw new Error('Request is null');
        }
    }

    protected async MainHandlerAsync(request: DeleteYardProjectsDto) {
        await this.uow.ExecuteAsync(async (queryRunner) => {
            const updatedSpecData = await this.yardProjectsRepository.DeleteYardProjects(request.uid, queryRunner);
            return updatedSpecData;
        });

        return;
    }
}
