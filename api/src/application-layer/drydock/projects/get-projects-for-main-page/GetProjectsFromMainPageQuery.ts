import { forEach } from 'lodash';
import { createQuery } from 'odata-v4-sql';

import { ApplicationException } from '../../../../bll/drydock/core/exceptions/ApplicationException';
import { ProjectsService } from '../../../../bll/drydock/projects/projects-service/ProjectsService';
import { ProjectsRepository } from '../../../../dal/drydock/projects/ProjectsRepository';
import { Query } from '../../core/cqrs/Query';
import { GetProjectsFromMainPageRequestDto } from './dtos/GetProjectsFromMainPageRequestDto';
import { GetProjectsFromMainPageResultDto } from './dtos/GetProjectsFromMainPageResultDto';

export class GetProjectsFromMainPageQuery extends Query<
    GetProjectsFromMainPageRequestDto,
    GetProjectsFromMainPageResultDto[]
> {
    projectsRepository: ProjectsRepository;
    projectsService: ProjectsService;

    constructor() {
        super();

        this.projectsRepository = new ProjectsRepository();
        this.projectsService = new ProjectsService();
    }

    protected async AuthorizationHandlerAsync(request: GetProjectsFromMainPageRequestDto): Promise<void> {
        return;
    }

    protected async ValidationHandlerAsync(request: GetProjectsFromMainPageRequestDto): Promise<void> {
        if (!request || !request.odata) {
            throw new ApplicationException('Request odata is required');
        }

        return;
    }

    /**
     *
     * @returns All example projects, which were created after the latest projects date
     */
    protected async MainHandlerAsync(
        request: GetProjectsFromMainPageRequestDto,
    ): Promise<GetProjectsFromMainPageResultDto[]> {
        let query = createQuery(request.odata);

        const projectTypes = await this.projectsRepository.GetProjectTypes();
        const projectStates = await this.projectsRepository.GetProjectStates();

        const projects = await this.projectsRepository.GetProjectsForMainPage();

        const dtos: GetProjectsFromMainPageResultDto[] = [];

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

            const dto = new GetProjectsFromMainPageResultDto();

            dto.ProjectId = project.ProjectId;
            dto.Code = code;
            dto.ProjectType = projectType.ProjectTypeName;
            dto.ProjectManager = project.ProjectManager;
            dto.ShipYard = 'Country ave.Name 123';
            dto.Specification = '330/500';
            dto.State = projectState.ProjectStateName;
            dto.Status = 'Specification overal status';
            dto.Vessel = project.VesselName;

            dto.Subject = project.Subject;
            dto.StartDate = project.StartDate;
            dto.EndDate = project.EndDate;

            dtos.push(dto);
        });

        return dtos;
    }
}
