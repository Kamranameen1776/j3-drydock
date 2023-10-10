import { forEach } from 'lodash';
import { createQuery } from 'odata-v4-sql';

import { ApplicationException } from '../../../../bll/drydock/core/exceptions/ApplicationException';
import { ProjectsRepository } from '../../../../dal/drydock/projects/ProjectsRepository';
import { Query } from '../../core/cqrs/Query';
import { GetProjectsFromMainPageRequestDto } from './dtos/GetProjectsFromMainPageRequestDto';
import { GetProjectsFromMainPageResultDto } from './dtos/GetProjectsFromMainPageResultDto';

export class GetProjectsFromMainPageQuery extends Query<
    GetProjectsFromMainPageRequestDto,
    GetProjectsFromMainPageResultDto[]
> {
    projectsRepository: ProjectsRepository;

    constructor() {
        super();

        this.projectsRepository = new ProjectsRepository();
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

        const projects = await this.projectsRepository.GetProjectsForMainPage();

        const dtos: GetProjectsFromMainPageResultDto[] = [];

        forEach(projects, (project) => {
            const dto = new GetProjectsFromMainPageResultDto();

            dto.ProjectId = project.ProjectId;
            dto.ProjectCode = project.ProjectCode;
            dto.ProjectTypeName = project.ProjectTypeName;
            dto.ProjectManager = project.ProjectManager;
            dto.ShipYard = 'Country ave.Name 123';
            dto.Specification = '330/500';
            dto.ProjectState = project.ProjectStateName;

            // TODO: make join on task manager table
            dto.ProjectStatus = 'In progress';

            dto.Vessel = project.VesselName;

            dto.Subject = project.Subject;
            dto.StartDate = project.StartDate;
            dto.EndDate = project.EndDate;

            dtos.push(dto);
        });

        return dtos;
    }
}
