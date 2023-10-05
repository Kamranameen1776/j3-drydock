import { ProjectsService } from '../../../../bll/drydock/projects/projects-service/ProjectsService';
import { GetProjectManagersResultDto } from '../../../../dal/drydock/projects/dtos/GetProjectManagersResultDto';
import { ProjectsRepository } from '../../../../dal/drydock/projects/ProjectsRepository';
import { Query } from '../../core/cqrs/Query';

export class GetProjectsManagersQuery extends Query<void, GetProjectManagersResultDto[]> {
    projectsRepository: ProjectsRepository;
    projectsService: ProjectsService;

    constructor() {
        super();

        this.projectsRepository = new ProjectsRepository();
        this.projectsService = new ProjectsService();
    }

    protected async AuthorizationHandlerAsync(): Promise<void> {
        return;
    }

    protected async ValidationHandlerAsync(): Promise<void> {
        return;
    }

    /**
     *
     * @returns All example projects, which were created after the latest projects date
     */
    protected async MainHandlerAsync(): Promise<GetProjectManagersResultDto[]> {
        const projectsManagers = await this.projectsRepository.GetProjectsManagers();

        return projectsManagers;
    }
}
