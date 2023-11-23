import { SpecificationDetailsRepository } from '../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';
import { DeleteSpecificationDetailsDto } from './dtos/DeleteSpecificationDetailsDto';

export class DeleteSpecificationDetailsCommand extends Command<DeleteSpecificationDetailsDto, void> {
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

    protected async ValidationHandlerAsync(request: DeleteSpecificationDetailsDto): Promise<void> {
        if (!request) {
            throw new Error('Request is null');
        }
    }

    protected async MainHandlerAsync(request: DeleteSpecificationDetailsDto) {
        await this.uow.ExecuteAsync(async (queryRunner) => {
            const updatedSpecData = await this.specificationDetailsRepository.DeleteSpecificationDetails(
                request.uid,
                queryRunner,
            );
            return updatedSpecData;
        });

        return;
    }
}
