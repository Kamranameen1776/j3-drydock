import { Request } from 'express';
import { map } from 'lodash';
import { ODataResult } from 'shared/interfaces';

import { ApplicationException } from '../../../bll/drydock/core/exceptions/ApplicationException';
import { ProjectsRepository } from '../../../dal/drydock/projects/ProjectsRepository';
import { Query } from '../core/cqrs/Query';
import { IProjectsFromMainPageRecordDto } from './projects-for-main-page/dtos/IProjectsFromMainPageRecordDto';

export class GetProjectQuery extends Query<Request, IProjectsFromMainPageRecordDto> {
    projectsRepository: ProjectsRepository;

    constructor() {
        super();

        this.projectsRepository = new ProjectsRepository();
    }

    protected async AuthorizationHandlerAsync(): Promise<void> {
        return;
    }

    protected async ValidationHandlerAsync(request: Request): Promise<void> {
        if (!request || !request.query || !request.query.uid) {
            throw new ApplicationException('Request uid is required');
        }

        return;
    }

    /**
     * Get projects from main page
     * @param request Http request
     * @returns Projects from main page
     */
    protected async MainHandlerAsync(request: Request): Promise<IProjectsFromMainPageRecordDto> {
        const [record] = await this.projectsRepository.GetProject(request.query.uid as string);
        const project: IProjectsFromMainPageRecordDto = {
            ProjectId: record.ProjectId,
            ProjectCode: record.ProjectCode,
            ProjectTypeName: record.ProjectTypeName,
            ProjectManager: record.ProjectManager,

            // TODO: replace with real data
            ShipYard: 'Country ave.Name 123',
            Specification: '330/500',
            ProjectStatusName: record.ProjectStatusName,

            ProjectState: record.ProjectStateName,

            VesselName: record.VesselName,

            Subject: record.Subject,
            StartDate: record.StartDate,
            EndDate: record.EndDate,
        };

        return project;
    }
}
