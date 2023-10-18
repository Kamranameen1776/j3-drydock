import { AuthorizationException } from '../../../bll/drydock/core/exceptions/AuthorizationException';
import { ProjectService } from '../../../bll/drydock/projects/ProjectService';
import { ProjectsRepository } from '../../../dal/drydock/projects/ProjectsRepository';
import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';
import { DeleteProjectDto } from './dtos/DeleteProjectDto';


export class DeleteProjectCommand extends Command<DeleteProjectDto, void> {
    projectsRepository: ProjectsRepository;
    projectsService: ProjectService;
    uow: UnitOfWork;

    constructor() {
        super();

        this.projectsRepository = new ProjectsRepository();
        this.projectsService = new ProjectService();
        this.uow = new UnitOfWork();
    }

    protected async AuthorizationHandlerAsync(request: DeleteProjectDto): Promise<void> {
        
    }

    protected async ValidationHandlerAsync(request: DeleteProjectDto): Promise<void> {
        if (!request) {
            throw new Error('Request is null');
        }
    }

    /**
     *
     * @param request Project data for creation of the new project
     * @returns New created project result
     */
    protected async MainHandlerAsync(request: DeleteProjectDto): Promise<void> {
        request.DeletedAt = new Date()
        await this.uow.ExecuteAsync(async (queryRunner) => {
            const projectId = await this.projectsRepository.UpdateProject(request, queryRunner);
            return projectId;
        });

        return;
    }
}
