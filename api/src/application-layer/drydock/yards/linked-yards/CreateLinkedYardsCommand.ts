import { LinkedYardsRepository } from '../../../../dal/drydock/yards/linked-yards/LinkedYardsRepository';
import { Command } from '../../core/cqrs/Command';
import { UnitOfWork } from '../../core/uof/UnitOfWork';
import { CreateLinkedYardsDto } from './dtos/CreateLinkedYardsDto';

export class CreateLinkedYardsCommand extends Command<CreateLinkedYardsDto, void> {
    linkedYardsRepository: LinkedYardsRepository;
    uow: UnitOfWork;

    constructor() {
        super();

        this.linkedYardsRepository = new LinkedYardsRepository();
        this.uow = new UnitOfWork();
    }

    protected async AuthorizationHandlerAsync(): Promise<void> {
        return;
    }

    protected async ValidationHandlerAsync(request: CreateLinkedYardsDto): Promise<void> {
        if (!request) {
            throw new Error('Request is null');
        }
    }

    /**
     *
     * @param request data for creation of linked yards
     * @returns data of created linked yards from popup
     */
    protected async MainHandlerAsync(request: CreateLinkedYardsDto): Promise<void> {
        await this.uow.ExecuteAsync(async (queryRunner) => {
            const specData = await this.linkedYardsRepository.CreateLinkedYards(request, queryRunner);
            return specData;
        });

        return;
    }
}
