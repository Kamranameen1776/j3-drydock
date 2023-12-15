import { SynchronizerService } from 'j2utils';

import { ProjectMapper } from '../../../bll/drydock/projects/ProjectMapper';
import { ProjectService } from '../../../bll/drydock/projects/ProjectService';
import { getTableName } from '../../../common/drydock/ts-helpers/tableName';
import { ProjectsRepository } from '../../../dal/drydock/projects/ProjectsRepository';
import { VesselsRepository } from '../../../dal/drydock/vessels/VesselsRepository';
import { ProjectEntity } from '../../../entity/drydock';
import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';
import { UpdateProjectDto } from './dtos/UpdateProjectDto';
import { IProjectsFromMainPageRecordDto } from './projects-for-main-page/dtos/IProjectsFromMainPageRecordDto';

export class UpdateProjectCommand extends Command<UpdateProjectDto, IProjectsFromMainPageRecordDto> {
    projectsRepository: ProjectsRepository;
    projectsService: ProjectService;
    uow: UnitOfWork;
    vesselRepository: VesselsRepository;
    tableName = getTableName(ProjectEntity);

    constructor() {
        super();

        this.projectsRepository = new ProjectsRepository();
        this.projectsService = new ProjectService();
        this.uow = new UnitOfWork();
        this.vesselRepository = new VesselsRepository();
    }

    protected async ValidationHandlerAsync(request: UpdateProjectDto): Promise<void> {
        if (!request) {
            throw new Error('Request is null');
        }
    }

    /**
     *
     * @param request Project data for creation of the new project
     * @returns New created project result
     */

    protected async MainHandlerAsync(request: UpdateProjectDto): Promise<IProjectsFromMainPageRecordDto> {
        const { uid } = request;
        const vessel = await this.vesselRepository.GetVesselByProjectUid(uid);
        await this.uow.ExecuteAsync(async (queryRunner) => {
            await this.projectsRepository.UpdateProject(request, queryRunner);
            await SynchronizerService.dataSynchronizeManager(
                queryRunner.manager,
                this.tableName,
                'uid',
                uid,
                vessel.VesselId,
            );
        });

        const [record] = await this.projectsRepository.GetProject(request.uid);
        return new ProjectMapper().map(record);
    }
}
