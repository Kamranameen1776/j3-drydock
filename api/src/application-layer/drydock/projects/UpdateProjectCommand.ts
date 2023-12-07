import { SynchronizerService } from 'j2utils';

import { ProjectService } from '../../../bll/drydock/projects/ProjectService';
import { getTableName } from '../../../common/drydock/ts-helpers/tableName';
import { ProjectsRepository } from '../../../dal/drydock/projects/ProjectsRepository';
import { VesselsRepository } from '../../../dal/drydock/vessels/VesselsRepository';
import { ProjectEntity } from '../../../entity/drydock';
import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';
import { UpdateProjectDto } from './dtos/UpdateProjectDto';

export class UpdateProjectCommand extends Command<UpdateProjectDto, void> {
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
    protected async MainHandlerAsync(request: UpdateProjectDto): Promise<void> {
        const { uid } = request;
        const vessel = await this.vesselRepository.GetVesselByProjectUid(uid);
        await this.uow.ExecuteAsync(async (queryRunner) => {
            const projectId = await this.projectsRepository.UpdateProject(request, queryRunner);
            await SynchronizerService.dataSynchronizeManager(
                queryRunner.manager,
                this.tableName,
                'uid',
                uid,
                vessel.VesselId,
            );
            return projectId;
        });
    }
}
