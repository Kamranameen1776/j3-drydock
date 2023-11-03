import { YardRepository } from '../../../dal/drydock/yard/YardRepository';
import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';
import { CreateAndUpdateYardDto } from './dtos/CreateAndUpdateYardDto';

export class CreateYardCommand extends Command<CreateAndUpdateYardDto, void> {
    yardRepository: YardRepository;
    uow: UnitOfWork;

    constructor() {
        super();

        this.yardRepository = new YardRepository();
        this.uow = new UnitOfWork();
    }

    protected async AuthorizationHandlerAsync(): Promise<void> {
        return;
    }

    protected async ValidationHandlerAsync(request: CreateAndUpdateYardDto): Promise<void> {
        if (!request) {
            throw new Error('Request is null');
        }
    }

    protected async MainHandlerAsync(request: CreateAndUpdateYardDto): Promise<void> {
        await this.uow.ExecuteAsync(async (queryRunner) => {
            const specData = await this.yardRepository.CreateYard(request, queryRunner);
            return specData;
        });
        return;
    }
}
