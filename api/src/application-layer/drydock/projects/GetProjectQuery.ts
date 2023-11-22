import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Request } from 'express';

import { ProjectsRepository } from '../../../dal/drydock/projects/ProjectsRepository';
import { Query } from '../core/cqrs/Query';
import { GetProjectByUidDto } from './dtos/GetProjectByUidDto';
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
        const query: GetProjectByUidDto = plainToClass(GetProjectByUidDto, request.query);
        const result = await validate(query);
        if (result.length) {
            throw result;
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
            ProjectManagerUid: record.ProjectManagerUid,

            // TODO: replace with real data
            ShipYard: 'Country ave.Name 123',
            Specification: '330/500',
            ProjectStatusName: record.ProjectStatusName,

            ProjectState: record.ProjectStateName,

            VesselName: record.VesselName,
            VesselUid: record.VesselUid,

            Subject: record.Subject,
            StartDate: record.StartDate,
            EndDate: record.EndDate,
        };

        return project;
    }
}
