import { validate } from 'class-validator';
import { DataUtilService, SynchronizerService } from 'j2utils';

import { ApplicationException } from '../../../bll/drydock/core/exceptions';
import { ProjectService } from '../../../bll/drydock/projects/ProjectService';
import { getTableName } from '../../../common/drydock/ts-helpers/tableName';
import { YardsProjectsRepository } from '../../../dal/drydock/project-yards/YardsProjectsRepository';
import { ProjectsRepository } from '../../../dal/drydock/projects/ProjectsRepository';
import { VesselsRepository } from '../../../dal/drydock/vessels/VesselsRepository';
import { ProjectEntity, YardsProjectsEntity } from '../../../entity/drydock';
import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';
import { UpdateProjectDto } from './dtos/UpdateProjectDto';

export class UpdateProjectCommand extends Command<UpdateProjectDto, void> {
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

        const result = await validate(request);

        if (result.length) {
            throw result;
        }
    }

    /**
     *
     * @param request Project data for creation of the new project
     * @returns New created project result
     */

    protected async MainHandlerAsync(request: UpdateProjectDto): Promise<void> {
        const project = await this.projectsRepository.TryGetProjectByUid(request.ProjectUid);

        if (!project) {
            throw new ApplicationException(`Project ${request.ProjectUid} not found`);
        }

        const vessel = await this.vesselRepository.GetVesselByProjectUid(project.uid);

        if (!vessel) {
            throw new ApplicationException(`Vessel ${project.VesselUid} not found`);
        }

        await this.uow.ExecuteAsync(async (queryRunner) => {
            let projectYard = await this.yardProjectsRepository.FindProjectYardByProjectUid(request.ProjectUid);

            if (request.ShipYardId) {
                if (projectYard) {
                    projectYard.is_selected = true;
                    projectYard.yard_uid = request.ShipYardId;
                } else {
                    projectYard = new YardsProjectsEntity();
                    projectYard.uid = new DataUtilService().newUid();
                    projectYard.yard_uid = request.ShipYardId;
                    projectYard.project_uid = project.uid;
                    projectYard.active_status = true;
                    projectYard.is_selected = true;
                    projectYard.created_at = request.LastUpdated;
                    projectYard.created_by = request.UpdatedBy;
                }
                projectYard.updated_at = request.LastUpdated;
                projectYard.updated_by = request.UpdatedBy;

                await this.yardProjectsRepository.SaveProjectYard(projectYard, queryRunner);
            } else if (projectYard) {
                projectYard.active_status = false;
                projectYard.deleted_at = request.LastUpdated;
                projectYard.deleted_by = request.UpdatedBy;

                await this.yardProjectsRepository.SaveProjectYard(projectYard, queryRunner);
            }

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
    }
}
