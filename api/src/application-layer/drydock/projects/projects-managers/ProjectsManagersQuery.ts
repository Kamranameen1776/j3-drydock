import { ProjectManagerService } from '../../../../bll/drydock/projects/ProjectManagerService';
import { ProjectsRepository } from '../../../../dal/drydock/projects/ProjectsRepository';
import { Query } from '../../core/cqrs/Query';
import { IProjectsManagersResultDto } from './IProjectsManagersResultDto';

export class ProjectsManagersQuery extends Query<void, IProjectsManagersResultDto[]> {
    projectsRepository: ProjectsRepository;
    projectManagerService: ProjectManagerService;

    constructor() {
        super();

        this.projectsRepository = new ProjectsRepository();
        this.projectManagerService = new ProjectManagerService();
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
    protected async MainHandlerAsync(): Promise<IProjectsManagersResultDto[]> {
        const projectsManagers = await this.projectsRepository.GetProjectsManagers();

        const dtos: IProjectsManagersResultDto[] = projectsManagers.map((projectManager) => {
            const dto: IProjectsManagersResultDto = {
                ManagerId: projectManager.LibUserUid,
                FullName: this.projectManagerService.GetFullName(projectManager.FirstName, projectManager.LastName),
            };

            return dto;
        });

        return dtos;
    }
}
