import { map } from 'lodash';

import { Req } from '../../../../common/drydock/ts-helpers/req-res';
import { ProjectsRepository } from '../../../../dal/drydock/projects/ProjectsRepository';
import { SlfAccessor } from '../../../../external-services/drydock/SlfAccessor';
import { ODataBodyDto } from '../../../../shared/dto';
import { ODataResult } from '../../../../shared/interfaces/odata-result.interface';
import { Query } from '../../core/cqrs/Query';
import { IProjectsFromMainPageRecordDto } from './dtos/IProjectsFromMainPageRecordDto';

export class ProjectsFromMainPageQuery extends Query<Req<ODataBodyDto>, ODataResult<IProjectsFromMainPageRecordDto>> {
    projectsRepository: ProjectsRepository;
    slfAccessor: SlfAccessor;

    constructor() {
        super();

        this.projectsRepository = new ProjectsRepository();
        this.slfAccessor = new SlfAccessor();
    }

    protected async AuthorizationHandlerAsync(): Promise<void> {
        return;
    }

    /**
     * Get projects from main page
     * @param request Http request
     * @returns Projects from main page
     */
    protected async MainHandlerAsync(request: Req<ODataBodyDto>): Promise<ODataResult<IProjectsFromMainPageRecordDto>> {
        const token: string = request.headers.authorization as string;

        const assignedVessels: number[] = await this.slfAccessor.getUserAssignedVessels(token);
        const data = await this.projectsRepository.GetProjectsForMainPage(request, assignedVessels);

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
