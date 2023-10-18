import { AuthorizationException } from '../../../bll/drydock/core/exceptions/AuthorizationException';
import { ProjectService } from '../../../bll/drydock/projects/ProjectService';
import { ProjectsRepository } from '../../../dal/drydock/projects/ProjectsRepository';
import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';
import { CreateProjectDto } from './dtos/CreateProjectDto';
import { CreateProjectResultDto } from './dtos/CreateProjectResultDto';


export class CreateProjectCommand extends Command<CreateProjectDto, void> {
    projectsRepository: ProjectsRepository;
    projectsService: ProjectService;
    uow: UnitOfWork;

    constructor() {
        super();

        this.projectsRepository = new ProjectsRepository();
        this.projectsService = new ProjectService();
        this.uow = new UnitOfWork();
    }

    protected async AuthorizationHandlerAsync(request: CreateProjectDto): Promise<void> {
        
    }

    protected async ValidationHandlerAsync(request: CreateProjectDto): Promise<void> {
        if (!request) {
            throw new Error('Request is null');
        }
    }

    /**
     *
     * @param request Project data for creation of the new project
     * @returns New created project result
     */
    protected async MainHandlerAsync(request: CreateProjectDto): Promise<void> {
        // const result = new CreateProjectResultDto();
        
        request.CreatedAtOffice = !this.projectsService.IsVessel();
        request.ProjectCode = this.projectsService.GetProjectCode();
        request.ProjectStateId = 1,

        await this.uow.ExecuteAsync(async (queryRunner) => {
            
            const projectId = await this.projectsRepository.CreateProject(request, queryRunner);
            return projectId;
        });

        return;
    }
}
