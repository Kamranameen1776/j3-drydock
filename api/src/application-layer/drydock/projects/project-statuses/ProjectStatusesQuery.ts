import { ProjectsRepository } from '../../../../dal/drydock/projects/ProjectsRepository';
import { Query } from '../../core/cqrs/Query';
import { ProjectStatusesResultDto } from './ProjectStatusesResultDto';

export class ProjectStatusesQuery extends Query<void, ProjectStatusesResultDto[]> {
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
    protected async MainHandlerAsync(): Promise<ProjectStatusesResultDto[]> {

        const dtos = new Array<ProjectStatusesResultDto>();

        // TODO: Get data from database
        dtos.push({ StatusCode: '1', StatusName: 'In Progress' });
        dtos.push({ StatusCode: '2', StatusName: 'Planning' });
        dtos.push({ StatusCode: '3', StatusName: 'Completed' });
        dtos.push({ StatusCode: '4', StatusName: 'Failed' });

        return dtos;
    }
}
