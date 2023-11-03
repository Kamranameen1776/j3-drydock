import { SpecificationDetailsRepository } from '../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';
import { SpecificationDetailsDto } from './dtos/SpecificationDetailsDto';

export class CreateSpecificationDetailsCommand extends Command<SpecificationDetailsDto, void> {
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

    protected async ValidationHandlerAsync(request: SpecificationDetailsDto): Promise<void> {
        if (!request) {
            throw new Error('Request is null');
        }
    }

    /**
     *
     * @param request data for creation of specification details
     * @returns data of specification details
     */
    protected async MainHandlerAsync(request: SpecificationDetailsDto): Promise<void> {
        await this.uow.ExecuteAsync(async (queryRunner) => {
            const specData = await this.specificationDetailsRepository.CreateSpecificationDetails(request, queryRunner);
            return specData;
        });

        return;
    }
}
