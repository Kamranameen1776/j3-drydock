import { ProjectStatusResultDto } from '../../../../dal/drydock/projects/dtos/ProjectStatusResultDto';
import { ProjectsRepository } from '../../../../dal/drydock/projects/ProjectsRepository';
import { Query } from '../../core/cqrs/Query';

export class ProjectStatusesQuery extends Query<void, ProjectStatusResultDto[]> {
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
    protected async MainHandlerAsync(): Promise<ProjectStatusResultDto[]> {
        const projectStatuses = this.projectsRepository.GetProjectStatuses();

        return projectStatuses;
    }
}
