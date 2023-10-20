import { SpecificationDetailsRepository } from '../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';
import { CreateSpecificationDetailsDto } from './dtos/CreateSpecificationDetailsDto';

export class CreateSpecificationDetailsCommand extends Command<CreateSpecificationDetailsDto, void> {
    specificationDetailsRepository: SpecificationDetailsRepository;
    //projectsService: ProjectService;
    uow: UnitOfWork;

    constructor() {
        super();

        this.specificationDetailsRepository = new SpecificationDetailsRepository();
        // this.projectsService = new ProjectService();
        this.uow = new UnitOfWork();
    }

    protected async AuthorizationHandlerAsync(): Promise<void> {
        return;
    }

    protected async ValidationHandlerAsync(request: CreateSpecificationDetailsDto): Promise<void> {
        if (!request) {
            throw new Error('Request is null');
        }
    }

    /**
     *
     * @param request data for creation of specification details
     * @returns data of specification details
     */
    protected async MainHandlerAsync(request: CreateSpecificationDetailsDto): Promise<void> {
        // const result = new CreateProjectResultDto();

        // request.CreatedAtOffice = !this.projectsService.IsVessel();
        // request.ProjectCode = this.projectsService.GetProjectCode();
        //(request.ProjectStateId = 1),
        await this.uow.ExecuteAsync(async (queryRunner) => {
            const projectId = await this.specificationDetailsRepository.CreateSpecificationDetails(
                request,
                queryRunner,
            );
            return projectId;
        });

        return;
    }
}
