import { ProjectsRepository } from '../../../../dal/drydock/projects/ProjectsRepository';
import { Query } from '../../core/cqrs/Query';
import { ProjectsSpecificationsStatusesResultDto } from './ProjectsSpecificationsStatusesResultDto';

export class ProjectsSpecificationsStatusesQuery extends Query<void, ProjectsSpecificationsStatusesResultDto[]> {
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
    protected async MainHandlerAsync(): Promise<ProjectsSpecificationsStatusesResultDto[]> {

        const dtos = new Array<ProjectsSpecificationsStatusesResultDto>();

        // TODO: Get data from database
        dtos.push({ SpecificationStatusCode: '1', SpecificationStatusName: 'In Progress' });
        dtos.push({ SpecificationStatusCode: '2', SpecificationStatusName: 'Planning' });
        dtos.push({ SpecificationStatusCode: '2', SpecificationStatusName: 'Completed' });

        return dtos;
    }
}
