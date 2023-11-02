import { IProjectStatusResultDto } from '../../../../dal/drydock/projects/dtos/IProjectStatusResultDto';
import { ProjectsRepository } from '../../../../dal/drydock/projects/ProjectsRepository';
import { Query } from '../../core/cqrs/Query';

export class ProjectStatusesQuery extends Query<void, IProjectStatusResultDto[]> {
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
     * Get project statuses
     * @returns Project statuses
     */
    protected async MainHandlerAsync(): Promise<IProjectStatusResultDto[]> {
        const projectStatuses = this.projectsRepository.GetProjectStatuses();

        return projectStatuses;
    }
}
