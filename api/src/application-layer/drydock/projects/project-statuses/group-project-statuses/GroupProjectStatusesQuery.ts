import { Request } from 'express';

import { GroupProjectStatusId } from '../../../../../bll/drydock/projects/Project/GroupProjectStatusId';
import { ProjectsRepository } from '../../../../../dal/drydock/projects/ProjectsRepository';
import { SlfAccessor } from '../../../../../external-services/drydock/SlfAccessor';
import { Query } from '../../../core/cqrs/Query';
import { IGroupProjectStatusDto } from './dtos/IGroupProjectStatusDto';
import { IGroupProjectStatusesDto } from './dtos/IGroupProjectStatusesDto';

export class GroupProjectStatusesQuery extends Query<Request, IGroupProjectStatusesDto[]> {
    readonly allProjectsProjectTypeId = 'all_projects';

    readonly allProjectsName = 'All Projects';

    readonly projectsRepository: ProjectsRepository;
    readonly slfAccessor: SlfAccessor;

    constructor() {
        super();

        this.projectsRepository = new ProjectsRepository();
        this.slfAccessor = new SlfAccessor();
    }

    protected async AuthorizationHandlerAsync(): Promise<void> {
        return;
    }

    protected async ValidationHandlerAsync(): Promise<void> {
        return;
    }

    /**
     * Get group project statuses, like "Complete", "In Progress", "Planned", "Closed", etc.
     * @returns Group project statuses
     */
    protected async MainHandlerAsync(request: Request): Promise<IGroupProjectStatusesDto[]> {
        const token: string = request.headers.authorization as string;
        const assignedVessels: number[] = await this.slfAccessor.getUserAssignedVessels(token);

        const projectsWithGroupStatusCount = await this.projectsRepository.GetGroupProjectStatusesByProjectType(
            assignedVessels,
        );

        const all_ProjectsWithGroupStatusCount = await this.projectsRepository.GetGroupProjectStatuses(assignedVessels);

        const projectTypes = await this.projectsRepository.GetProjectTypes();

        const all_projects: IGroupProjectStatusesDto = {
            ProjectTypeId: this.allProjectsProjectTypeId,
            ProjectTypeName: this.allProjectsName,
            GroupProjectStatuses: this.populateGroupStatuses(all_ProjectsWithGroupStatusCount),
        };

        const groupStatusesByType: IGroupProjectStatusesDto[] = projectTypes.map((projectType) => {
            const groupStatuses: IGroupProjectStatusDto[] = projectsWithGroupStatusCount
                .filter((project) => project.ProjectTypeId === projectType.ProjectTypeCode)
                .map((project) => {
                    return {
                        GroupProjectStatusId: project.GroupProjectStatusId,
                        ProjectWithStatusCount: project.ProjectWithStatusCount,
                    };
                });

            return {
                ProjectTypeId: projectType.ProjectTypeCode,
                ProjectTypeName: projectType.ProjectTypeName,
                GroupProjectStatuses: this.populateGroupStatuses(groupStatuses),
            };
        });

        return [...[all_projects], ...groupStatusesByType];
    }

    public populateGroupStatuses(projectStatuses: IGroupProjectStatusDto[]): IGroupProjectStatusDto[] {
        const groupProjectStatusesIds = Object.keys(GroupProjectStatusId);

        return groupProjectStatusesIds.map((groupStatus) => {
            const data: IGroupProjectStatusDto = {
                GroupProjectStatusId: groupStatus,
                ProjectWithStatusCount: 0,
            };

            const project = projectStatuses.find((project) => project.GroupProjectStatusId === groupStatus);

            if (project) {
                data.ProjectWithStatusCount = project.ProjectWithStatusCount;
            }

            return data;
        });
    }
}
