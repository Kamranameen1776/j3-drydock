import { Request } from 'express';
import { map } from 'lodash';
import { ODataResult } from 'shared/interfaces';

import { ApplicationException } from '../../../../bll/drydock/core/exceptions/ApplicationException';
import { ProjectsRepository } from '../../../../dal/drydock/projects/ProjectsRepository';
import { Query } from '../../core/cqrs/Query';
import { IProjectsFromMainPageRecordDto } from './dtos/IProjectsFromMainPageRecordDto';

export class ProjectsFromMainPageQuery extends Query<Request, ODataResult<IProjectsFromMainPageRecordDto>> {
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
     * Get projects from main page
     * @param request Http request
     * @returns Projects from main page
     */
    protected async MainHandlerAsync(request: Request): Promise<ODataResult<IProjectsFromMainPageRecordDto>> {
        const data = await this.projectsRepository.GetProjectsForMainPage(request);

        const result: ODataResult<IProjectsFromMainPageRecordDto> = {
            count: data.count,
            records: map(data.records, (record) => {
                const project: IProjectsFromMainPageRecordDto = {
                    ProjectId: record.ProjectId,
                    ProjectCode: record.ProjectCode,
                    ProjectTypeName: record.ProjectTypeName,
                    ProjectManager: record.ProjectManager,

                    ShipYard: record.ShipYard,
                    ShipYardId: record.ShipYardUid,
                    Specification: record.Specification,
                    ProjectStatusName: record.ProjectStatusName,
                    ProjectStatusId: record.ProjectStatusId,

                    ProjectState: record.ProjectStateName,

                    VesselName: record.VesselName,

                    Subject: record.Subject,
                    StartDate: record.StartDate,
                    EndDate: record.EndDate,
                    TaskManagerUid: record.TaskManagerUid,
                };

                return project;
            }),
        };

        return result;
    }
}
