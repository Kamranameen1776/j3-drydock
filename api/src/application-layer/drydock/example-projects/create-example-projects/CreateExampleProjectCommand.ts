import { AuthorizationException } from '../../../../bll/drydock/core/exceptions/AuthorizationException';
import { ExampleProjectsService } from '../../../../bll/drydock/example-projects/ExampleProjectsService';
import { ExampleProjectsRepository } from '../../../../dal/drydock/example-projects/ExampleProjectsRepository';
import { Command } from '../../core/cqrs/Command';
import { UnitOfWork } from '../../core/uof/UnitOfWork';
import { CreateExampleProjectDto } from './CreateExampleProjectDto';
import { ExampleProjectResultDto } from './ExampleProjectResultDto';

export class CreateExampleProjectCommand extends Command<CreateExampleProjectDto, ExampleProjectResultDto> {
    projectsRepository: ExampleProjectsRepository;
    projectsService: ExampleProjectsService;
    uow: UnitOfWork;

    constructor() {
        super();

        this.projectsRepository = new ExampleProjectsRepository();
        this.projectsService = new ExampleProjectsService();
        this.uow = new UnitOfWork();
    }

    protected async AuthorizationHandlerAsync(request: CreateExampleProjectDto): Promise<void> {
        if (request.UserUid === 'hemant_95FCD734-A03A-4494-93F2-76B8B5E0C508') {
            throw new AuthorizationException('User is not allowed to create example projects');
        }
    }

    protected async ValidationHandlerAsync(request: CreateExampleProjectDto): Promise<void> {
        if (!request) {
            throw new Error('Request is null');
        }
    }

    /**
     *
     * @param request Project data for creation of the new project
     * @returns New created project result
     */
    protected async MainHandlerAsync(request: CreateExampleProjectDto): Promise<ExampleProjectResultDto> {
        const name = request.Name;

        const dateOfCreation = new Date();

        const changedName = this.projectsService.ChangeProjectName(name, dateOfCreation);

        const result = new ExampleProjectResultDto();

        result.ExampleProjectId = await this.uow.ExecuteAsync(async () => {
            const projectId = await this.projectsRepository.CreateProject(changedName, dateOfCreation);

            // const specificationId = await this.specificationRepository.CreateSpecification(projectId);

            return projectId;
        });

        return result;
    }
}
