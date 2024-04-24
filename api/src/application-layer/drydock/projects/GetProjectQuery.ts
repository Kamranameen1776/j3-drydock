import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

import { AuthorizationException } from '../../../bll/drydock/core/exceptions';
import { ProjectMapper } from '../../../bll/drydock/projects/ProjectMapper';
import { ProjectsRepository } from '../../../dal/drydock/projects/ProjectsRepository';
import { VesselsRepository } from '../../../dal/drydock/vessels/VesselsRepository';
import { SlfAccessor } from '../../../external-services/drydock/SlfAccessor';
import { Query } from '../core/cqrs/Query';
import { GetProjectByUidDto } from './dtos/GetProjectByUidDto';
import { IProjectsFromMainPageRecordDto } from './projects-for-main-page/dtos/IProjectsFromMainPageRecordDto';

export class GetProjectQuery extends Query<GetProjectByUidDto, IProjectsFromMainPageRecordDto> {
    projectsRepository: ProjectsRepository;
    slfAccessor: SlfAccessor;
    vesselRepository: VesselsRepository;

    constructor() {
        super();

        this.projectsRepository = new ProjectsRepository();
        this.slfAccessor = new SlfAccessor();
        this.vesselRepository = new VesselsRepository();
    }

    protected async AuthorizationHandlerAsync(request: GetProjectByUidDto): Promise<void> {
        const vessel = await this.vesselRepository.GetVesselByProjectUid(request.uid);

        const assignedVessels: number[] = await this.slfAccessor.getUserAssignedVessels(request.token);

        if (!assignedVessels.includes(vessel.VesselId)) {
            throw new AuthorizationException(`You have no assignment on vessel: ${vessel.VesselName} `);
        }

        return;
    }

    protected async ValidationHandlerAsync(request: GetProjectByUidDto): Promise<void> {
        const query: GetProjectByUidDto = plainToClass(GetProjectByUidDto, request);

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
    protected async MainHandlerAsync(request: GetProjectByUidDto): Promise<IProjectsFromMainPageRecordDto> {
        const [record] = await this.projectsRepository.GetProject(request.uid);

        return new ProjectMapper().map(record);
    }
}
