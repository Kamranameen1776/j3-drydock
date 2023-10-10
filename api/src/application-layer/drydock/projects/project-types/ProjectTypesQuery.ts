import { ProjectTypeResultDto } from '../../../../dal/drydock/projects/dtos/ProjectTypeResultDto';
import { ProjectsRepository } from '../../../../dal/drydock/projects/ProjectsRepository';
import { Query } from '../../core/cqrs/Query';

export class ProjectTypesQuery extends Query<void, ProjectTypeResultDto[]> {
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
     *
     * @returns All example projects, which were created after the latest projects date
     */
    protected async MainHandlerAsync(): Promise<ProjectTypeResultDto[]> {
        const projectTypes = await this.projectsRepository.GetProjectTypes();

        return projectTypes;
    }
}
