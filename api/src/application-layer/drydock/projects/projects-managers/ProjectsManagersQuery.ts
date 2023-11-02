import { IProjectsManagersResultDto } from '../../../../dal/drydock/projects/dtos/IProjectsManagersResultDto';
import { ProjectsRepository } from '../../../../dal/drydock/projects/ProjectsRepository';
import { Query } from '../../core/cqrs/Query';

export class ProjectsManagersQuery extends Query<void, IProjectsManagersResultDto[]> {
    projectsRepository: ProjectsRepository;

    constructor() {
        super();

        this.projectsRepository = new ProjectsRepository();
    }

    protected async AuthorizationHandlerAsync(): Promise<void> {
        return;
    }

    protected async ValidationHandlerAsync(): Promise<void> {
        return;
    }

    /**
     * Get projects managers assigned to projects
     * @returns Projects managers
     */
    protected async MainHandlerAsync(): Promise<IProjectsManagersResultDto[]> {
        const projectsManagers = await this.projectsRepository.GetProjectsManagers();

        return projectsManagers;
    }
}
