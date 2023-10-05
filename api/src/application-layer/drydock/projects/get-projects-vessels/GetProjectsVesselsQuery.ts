import { ProjectsService } from '../../../../bll/drydock/projects/projects-service/ProjectsService';
import { GetProjectVesselsResultDto } from '../../../../dal/drydock/projects/dtos/GetProjectVesselsResultDto';
import { ProjectsRepository } from '../../../../dal/drydock/projects/ProjectsRepository';
import { Query } from '../../core/cqrs/Query';

export class GetProjectsVesselsQuery extends Query<void, GetProjectVesselsResultDto[]> {
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
    protected async MainHandlerAsync(): Promise<GetProjectVesselsResultDto[]> {
        const projectsManagers = await this.projectsRepository.GetProjectsVessels();

        return projectsManagers;
    }
}
