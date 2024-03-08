import { ProjectsRepository } from '../../../../../dal/drydock/projects/ProjectsRepository';
import { SlfAccessor } from '../../../../../external-services/drydock/SlfAccessor';
import { Query } from '../../../core/cqrs/Query';
import {
    IGroupProjectStatusAsyncDto,
    IGroupProjectStatusesAsyncDto,
    IGroupResponseAsyncDto,
} from './dtos/IGroupProjectStatusDto';

export class GroupProjectStatusesAsyncQuery extends Query<string, IGroupResponseAsyncDto> {
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
    protected async MainHandlerAsync(): Promise<IGroupResponseAsyncDto> {
        const rawData = await this.projectsRepository.GetGroupStatusesAsyncRawData();

        const result: IGroupResponseAsyncDto = {
            [this.allProjectsProjectTypeId]: {
                ProjectTypeName: this.allProjectsName,
                GroupProjectStatuses: [],
            },
        };

        for (let i = 0; i < rawData.length; i++) {
            const { GroupProjectStatusId, ProjectTypeId, GroupProjectDisplayName, ProjectTypeName, StatusOrder } =
                rawData[i];

            //Populate "all" projects
            const all: IGroupProjectStatusesAsyncDto = result[this.allProjectsProjectTypeId];
            let index = all.GroupProjectStatuses.findIndex(
                (t: IGroupProjectStatusAsyncDto) => t.GroupProjectStatusId === GroupProjectStatusId,
            );

            if (index === -1) {
                index = all.GroupProjectStatuses.length;
                all.GroupProjectStatuses.push({
                    GroupProjectStatusId,
                    GroupProjectDisplayName,
                    StatusOrder,
                });
            }

            //Populate project type
            if (!result[ProjectTypeId]) {
                result[ProjectTypeId] = {
                    ProjectTypeName,
                    GroupProjectStatuses: [],
                };
            }

            result[ProjectTypeId].GroupProjectStatuses.push({
                GroupProjectStatusId,
                GroupProjectDisplayName,
                StatusOrder,
            });
        }

        return result;
    }
}
