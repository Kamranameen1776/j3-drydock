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

    /**
     *
     * @param request Project data for creation of the new project
     * @returns New created project result
     */
    protected async MainHandlerAsync(request: DeleteSpecificationDetailsDto): Promise<void> {
        request.DeletedAt = new Date();
        await this.uow.ExecuteAsync(async (queryRunner) => {
            const projectId = await this.specificationDetailsRepository.UpdateSpecificationDetails(
                request,
                queryRunner,
            );
            return projectId;
        });

        return;
    }
}
