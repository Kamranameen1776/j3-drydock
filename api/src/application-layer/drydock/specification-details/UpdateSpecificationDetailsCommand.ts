import { SpecificationDetailsRepository } from '../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';
import { CreateAndUpdateSpecificationDetailsDto } from './dtos/CreateAndUpdateSpecificationDetailsDto';

export class UpdateSpecificationDetailsCommand extends Command<CreateAndUpdateSpecificationDetailsDto, void> {
    specificationDetailsRepository: SpecificationDetailsRepository;
    uow: UnitOfWork;

    constructor() {
        super();

        this.specificationDetailsRepository = new SpecificationDetailsRepository();
        this.uow = new UnitOfWork();
    }

    protected async AuthorizationHandlerAsync(): Promise<void> {
        return;
    }

    protected async ValidationHandlerAsync(request: CreateAndUpdateSpecificationDetailsDto): Promise<void> {
        if (!request) {
            throw new Error('Request is null');
        }
    }

    protected async MainHandlerAsync(request: CreateAndUpdateSpecificationDetailsDto): Promise<void> {
        await this.uow.ExecuteAsync(async (queryRunner) => {
            const updatedSpecData = await this.specificationDetailsRepository.UpdateSpecificationDetails(
                request,
                queryRunner,
            );
            return updatedSpecData;
        });

        return;
    }
}
