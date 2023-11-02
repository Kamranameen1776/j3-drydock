import { YardSelectionRepository } from '../../../dal/drydock/yard-selection/YardSelectionRepository';
import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';
import { CreateAndUpdateYardSelectionDto } from './dtos/CreateAndUpdateYardSelectionDto';

export class CreateYardSelectionCommand extends Command<CreateAndUpdateYardSelectionDto, void> {
    yardSelectionRepository: YardSelectionRepository;
    uow: UnitOfWork;

    constructor() {
        super();

        this.yardSelectionRepository = new YardSelectionRepository();
        this.uow = new UnitOfWork();
    }

    protected async AuthorizationHandlerAsync(): Promise<void> {
        return;
    }

    protected async ValidationHandlerAsync(request: CreateAndUpdateYardSelectionDto): Promise<void> {
        if (!request) {
            throw new Error('Request is null');
        }
    }

    protected async MainHandlerAsync(request: CreateAndUpdateYardSelectionDto): Promise<void> {
        await this.uow.ExecuteAsync(async (queryRunner) => {
            const specData = await this.yardSelectionRepository.CreateYardSelection(request, queryRunner);
            return specData;
        });
        return;
    }
}
