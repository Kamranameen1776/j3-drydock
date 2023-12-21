import { DataUtilService, SynchronizerService } from 'j2utils';

import { ApplicationException } from '../../../bll/drydock/core/exceptions';
import { ProjectMapper } from '../../../bll/drydock/projects/ProjectMapper';
import { ProjectService } from '../../../bll/drydock/projects/ProjectService';
import { getTableName } from '../../../common/drydock/ts-helpers/tableName';
import { YardsProjectsRepository } from '../../../dal/drydock/project-yards/YardsProjectsRepository';
import { ProjectsRepository } from '../../../dal/drydock/projects/ProjectsRepository';
import { VesselsRepository } from '../../../dal/drydock/vessels/VesselsRepository';
import { ProjectEntity, YardsProjectsEntity } from '../../../entity/drydock';
import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';
import { UpdateProjectDto } from './dtos/UpdateProjectDto';
import { IProjectsFromMainPageRecordDto } from './projects-for-main-page/dtos/IProjectsFromMainPageRecordDto';

export class UpdateProjectCommand extends Command<UpdateProjectDto, IProjectsFromMainPageRecordDto> {
    projectsRepository: ProjectsRepository;
    projectsService: ProjectService;
    uow: UnitOfWork;
    vesselRepository: VesselsRepository;
    projectTableName = getTableName(ProjectEntity);
    projectYardTableName = getTableName(YardsProjectsEntity);
    yardProjectsRepository: YardsProjectsRepository;

    constructor() {
        super();

        this.projectsRepository = new ProjectsRepository();
        this.projectsService = new ProjectService();
        this.uow = new UnitOfWork();
        this.vesselRepository = new VesselsRepository();
        this.yardProjectsRepository = new YardsProjectsRepository();
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
        const project = await this.projectsRepository.TryGetProjectByUid(request.uid);

        if (!project) {
            throw new ApplicationException('Project not found');
        }

        const vessel = await this.vesselRepository.GetVesselByProjectUid(project.uid);

        if (!vessel) {
            throw new ApplicationException('Vessel not found');
        }

        const projectYards = await this.yardProjectsRepository.ListSelectedProjectYardsByProjectUid(project.uid);

        let selectedProjectYard = await this.yardProjectsRepository.TryGetProjectYardByYardUid(request.ShipYardId);

        await this.uow.ExecuteAsync(async (queryRunner) => {
            projectYards.forEach(async (projectYard) => {
                projectYard.is_selected = false;

                await this.yardProjectsRepository.SaveProjectYard(projectYard, queryRunner);
            });


            if (selectedProjectYard) {
                selectedProjectYard.is_selected = true;
            } else {
                selectedProjectYard = new YardsProjectsEntity();
                selectedProjectYard.uid = new DataUtilService().newUid();
                selectedProjectYard.yard_uid = request.ShipYardId;
                selectedProjectYard.project_uid = project.uid;
                selectedProjectYard.active_status = true;
                selectedProjectYard.is_selected = true;
            }

            await this.yardProjectsRepository.SaveProjectYard(selectedProjectYard, queryRunner);

            project.Subject = request.Subject;
            project.StartDate = request.StartDate;
            project.EndDate = request.EndDate;
            project.ProjectManagerUid = request.ProjectManagerUid;

            await this.projectsRepository.SaveProject(project, queryRunner);

            await SynchronizerService.dataSynchronizeManager(
                queryRunner.manager,
                this.projectTableName,
                'uid',
                project.uid,
                vessel.VesselId,
            );

            await SynchronizerService.dataSynchronizeManager(
                queryRunner.manager,
                this.projectYardTableName,
                'project_uid',
                project.uid,
                vessel.VesselId,
            );
        });

        const [record] = await this.projectsRepository.GetProject(request.uid);

        return new ProjectMapper().map(record);
    }
}
