import { ExampleProjectsService } from '../../../../bll/drydock/projects/example-projects-service/ExampleProjectsService';
import { GetExampleProjectsResultDto } from '../../../../dal/drydock/example-projects/dtos/GetExampleProjectsResultDto';
import { ExampleProjectsRepository } from '../../../../dal/drydock/example-projects/ExampleProjectsRepository';
import { Query } from '../../core/cqrs/Query';

export class GetExampleProjectsQuery extends Query<void, GetExampleProjectsResultDto[]> {
    projectsRepository: ExampleProjectsRepository;
    projectsService: ExampleProjectsService;

    constructor() {
        super();

        this.projectsRepository = new ExampleProjectsRepository();
        this.projectsService = new ExampleProjectsService();
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
    protected async MainHandlerAsync(): Promise<GetExampleProjectsResultDto[]> {
        const latestProjectsDate = this.projectsService.LatestProjectsDate;

        const projects = await this.projectsRepository.GetExampleProjects(latestProjectsDate);

        return projects;
    }
}
