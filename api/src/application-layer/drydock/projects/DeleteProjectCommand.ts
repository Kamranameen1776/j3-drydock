import { SynchronizerService } from 'j2utils';

import { ProjectService } from '../../../bll/drydock/projects/ProjectService';
import { getTableName } from '../../../common/drydock/ts-helpers/tableName';
import { ProjectsRepository } from '../../../dal/drydock/projects/ProjectsRepository';
import { VesselsRepository } from '../../../dal/drydock/vessels/VesselsRepository';
import { ProjectEntity } from '../../../entity/drydock';
import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';
import { IDeleteProjectDto } from './dtos/IDeleteProjectDto';

export class DeleteProjectCommand extends Command<IDeleteProjectDto, void> {
    projectsRepository: ProjectsRepository;
    projectsService: ProjectService;
    uow: UnitOfWork;
    vesselRepository: VesselsRepository;
    tableName = getTableName(ProjectEntity);

    constructor() {
        super();

        this.projectsRepository = new ProjectsRepository();
        this.projectsService = new ProjectService();
        this.vesselRepository = new VesselsRepository();
        this.uow = new UnitOfWork();
    }

    protected async ValidationHandlerAsync(request: IDeleteProjectDto): Promise<void> {
        if (!request) {
            throw new Error('Request is null');
        }
    }

    /**
     *
     * @param request Project data for creation of the new project
     * @returns New created project result
     */
    protected async MainHandlerAsync(request: IDeleteProjectDto): Promise<void> {
        const { ProjectId } = request;
        const vessel = await this.vesselRepository.GetVesselByProjectUid(ProjectId);
        await this.uow.ExecuteAsync(async (queryRunner) => {
            const projectId = await this.projectsRepository.DeleteProject(ProjectId, queryRunner);
            await SynchronizerService.dataSynchronizeManager(
                queryRunner.manager,
                this.tableName,
                'uid',
                ProjectId,
                vessel.VesselId,
            );
            return projectId;
        });
    }
}
