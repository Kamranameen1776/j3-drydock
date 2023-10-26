import { IProjectTypeResultDto } from '../../../../dal/drydock/projects/dtos/IProjectTypeResultDto';
import { ProjectsRepository } from '../../../../dal/drydock/projects/ProjectsRepository';
import { Query } from '../../core/cqrs/Query';

export class ProjectTypesQuery extends Query<void, IProjectTypeResultDto[]> {
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
     * Get project types
     * @returns Project types
     */
    protected async MainHandlerAsync(): Promise<IProjectTypeResultDto[]> {
        const projectTypes = await this.projectsRepository.GetProjectTypes();

        return projectTypes;
    }
}
