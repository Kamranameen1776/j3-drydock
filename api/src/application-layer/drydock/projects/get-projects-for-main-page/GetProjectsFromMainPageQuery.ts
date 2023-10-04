import { ApplicationException } from 'bll/drydock/core/exceptions/ApplicationException';
import { forEach } from 'lodash';

import { ProjectsService } from '../../../../bll/drydock/projects/projects-service/ProjectsService';
import { ProjectsRepository } from '../../../../dal/drydock/projects/ProjectsRepository';
import { Query } from '../../core/cqrs/Query';
import { GetProjectsFromMainPageDto } from './dtos/GetProjectsFromMainPageDto';

export class GetProjectsFromMainPageQuery extends Query<void, GetProjectsFromMainPageDto[]> {
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
    protected async MainHandlerAsync(): Promise<GetProjectsFromMainPageDto[]> {
        const projectTypes = await this.projectsRepository.GetProjectTypes();
        const projectStates = await this.projectsRepository.GetProjectStates();

        const projects = await this.projectsRepository.GetProjectsForMainPage();

        const dtos: GetProjectsFromMainPageDto[] = [];
        forEach(projects, (project) => {
            const code = this.projectsService.GetCode(
                project.ProjectTypeProjectTypeCode,
                project.CreatedAtOffice,
                project.ProjectShortCodeId,
            );

            const projectType = this.projectsService.GetProjectTypeByProjectTypeCode(
                projectTypes,
                project.ProjectTypeProjectTypeCode,
            );

            const projectState = this.projectsService.GetProjectStateByProjectStateCode(
                projectStates,
                project.ProjectStateProjectStateCode,
            );

            const dto = new GetProjectsFromMainPageDto();

            dto.ProjectId = project.ProjectId;
            dto.Code = code;
            dto.ProjectType = projectType.ProjectTypeName;
            dto.ProjectManager = 'First Second';
            dto.ShipYard = 'Country ave.Name 123';
            dto.Specification = '330/500';
            dto.State = projectState.ProjectStateName;
            dto.Status = 'Specification overal status';
            dto.Vessel = 'Haruko';

            dto.Subject = project.Subject;

            dtos.push(dto);
        });

        return dtos;
    }
}
