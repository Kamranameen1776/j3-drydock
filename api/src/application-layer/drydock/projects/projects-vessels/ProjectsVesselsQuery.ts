import { IProjectVesselsResultDto } from '../../../../dal/drydock/projects/dtos/IProjectVesselsResultDto';
import { ProjectsRepository } from '../../../../dal/drydock/projects/ProjectsRepository';
import { Query } from '../../core/cqrs/Query';

export class ProjectsVesselsQuery extends Query<void, IProjectVesselsResultDto[]> {
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
     * Get projects vessels assigned to projects
     * @returns Projects vessels
     */
    protected async MainHandlerAsync(): Promise<IProjectVesselsResultDto[]> {
        const projectsManagers = await this.projectsRepository.GetProjectsVessels();

        return projectsManagers;
    }
}
