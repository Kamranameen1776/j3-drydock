import { ProjectsRepository } from '../../../../../dal/drydock/projects/ProjectsRepository';
import { Cache } from '../../../../../external-services/drydock/Cache';
import { SlfAccessor } from '../../../../../external-services/drydock/SlfAccessor';
import { Query } from '../../../core/cqrs/Query';
import { GroupProjectStatusesCountsRequestModel } from './dtos/GroupProjectStatusesCountsRequestModel';
import { IGroupProjectStatusDto, IGroupProjectStatusesDto, IGroupResponseDto } from './dtos/IGroupProjectStatusDto';
export class GroupProjectStatusesQuery extends Query<GroupProjectStatusesCountsRequestModel, IGroupResponseDto> {
    readonly allProjectsProjectTypeId = 'all_projects';

    readonly allProjectsName = 'All Projects';

    readonly projectsRepository: ProjectsRepository;
    readonly slfAccessor: SlfAccessor;
    readonly cache = new Cache('project', 'dry_dock', '.groupStatuses');

    constructor() {
        super();

        this.projectsRepository = new ProjectsRepository();
        this.slfAccessor = new SlfAccessor();
    }

    /**
     * Get group project statuses, like "Complete", "In Progress", "Planned", "Closed", etc.
     * @returns Group project statuses
     */
    protected async MainHandlerAsync(request: GroupProjectStatusesCountsRequestModel): Promise<IGroupResponseDto> {
        let assignedVessels: number[] = await this.slfAccessor.getUserAssignedVessels(request.Token);

        if (request.VesselsIds != null && request.VesselsIds.length > 0) {
            assignedVessels = assignedVessels.filter((vesselId) => request.VesselsIds!.includes(vesselId));
        }

        const cacheKey = assignedVessels.join('|');
        const cacheValue = await this.cache.get(cacheKey);
        if (cacheValue) {
            return cacheValue;
        }

        const rawData = await this.projectsRepository.GetGroupStatusesRawData(assignedVessels);

        const result: IGroupResponseDto = {
            [this.allProjectsProjectTypeId]: {
                ProjectTypeName: this.allProjectsName,
                GroupProjectStatuses: [],
            },
        };
        for (let i = 0; i < rawData.length; i++) {
            const {
                GroupProjectStatusId,
                ProjectTypeId,
                GroupProjectDisplayName,
                ProjectWithStatusCount,
                ProjectTypeName,
                StatusOrder,
            } = rawData[i];

            //Populate "all" projects
            const all: IGroupProjectStatusesDto = result[this.allProjectsProjectTypeId];
            let index = all.GroupProjectStatuses.findIndex(
                (t: IGroupProjectStatusDto) => t.GroupProjectStatusId === GroupProjectStatusId,
            );
            if (index === -1) {
                index = all.GroupProjectStatuses.length;
                all.GroupProjectStatuses.push({
                    GroupProjectStatusId,
                    GroupProjectDisplayName,
                    ProjectWithStatusCount: 0,
                    StatusOrder,
                });
            }
            all.GroupProjectStatuses[index].ProjectWithStatusCount += ProjectWithStatusCount;

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
                ProjectWithStatusCount,
                StatusOrder,
            });
        }

        await this.cache.put(result, cacheKey, 300);

        return result;
    }
}
