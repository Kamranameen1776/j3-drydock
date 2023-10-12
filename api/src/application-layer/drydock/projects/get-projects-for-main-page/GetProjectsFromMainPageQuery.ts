import { Request } from 'express';
import { forEach } from 'lodash';

import { ApplicationException } from '../../../../bll/drydock/core/exceptions/ApplicationException';
import { ProjectsRepository } from '../../../../dal/drydock/projects/ProjectsRepository';
import { Query } from '../../core/cqrs/Query';
import {
    GetProjectsFromMainPageRecord,
    GetProjectsFromMainPageResultDto,
} from './dtos/GetProjectsFromMainPageResultDto';

export class GetProjectsFromMainPageQuery extends Query<Request, GetProjectsFromMainPageResultDto> {
    projectsRepository: ProjectsRepository;

    constructor() {
        super();

        this.projectsRepository = new ProjectsRepository();
    }

    protected async AuthorizationHandlerAsync(): Promise<void> {
        return;
    }

    protected async ValidationHandlerAsync(request: Request): Promise<void> {
        if (!request || !request.body || !request.body.odata) {
            throw new ApplicationException('Request odata is required');
        }

        return;
    }

    /**
     *
     * @returns All example projects, which were created after the latest projects date
     */
    protected async MainHandlerAsync(request: Request): Promise<GetProjectsFromMainPageResultDto> {
        const data = await this.projectsRepository.GetProjectsForMainPage(request);

        const result = new GetProjectsFromMainPageResultDto();
        result.count = data.count;
        result.records = [];

        forEach(data.records, (project) => {
            const dto = new GetProjectsFromMainPageRecord();

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

            result.records.push(dto);
        });

        return result;
    }
}
