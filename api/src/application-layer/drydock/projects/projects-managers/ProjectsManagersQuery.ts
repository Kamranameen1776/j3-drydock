import { forEach } from 'lodash';

import { ProjectManagerService } from '../../../../bll/drydock/projects/ProjectManagerService';
import { GetProjectManagersResultDto } from '../../../../dal/drydock/projects/dtos/GetProjectManagersResultDto';
import { ProjectsRepository } from '../../../../dal/drydock/projects/ProjectsRepository';
import { Query } from '../../core/cqrs/Query';
import { ProjectsManagersResultDto } from './ProjectsManagersResultDto';

export class ProjectsManagersQuery extends Query<void, ProjectsManagersResultDto[]> {
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
    protected async MainHandlerAsync(): Promise<ProjectsManagersResultDto[]> {
        const projectsManagers = await this.projectsRepository.GetProjectsManagers();

        const dtos = new Array<ProjectsManagersResultDto>();

        forEach(projectsManagers, (projectManager) => {
            const dto = new ProjectsManagersResultDto();

            dto.ManagerId = projectManager.LibUserUid;
            dto.FullName = this.projectManagerService.GetFullName(projectManager.FirstName, projectManager.LastName);

            dtos.push(dto);
        });

        return dtos;
    }
}
