import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { DataUtilService, SynchronizerService } from 'j2utils';
import { QueryRunner } from 'typeorm';

import { ApplicationException, BusinessException } from '../../../bll/drydock/core/exceptions';
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

        const result = await validate(plainToClass(UpdateProjectDto, request));

        if (result.length) {
            throw result;
        }

        if (request.EndDate < request.StartDate) {
            throw new BusinessException('Project start date must be earlier than or equal to project end date');
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
                    await this.SelectProjectYard(projectYard, request, queryRunner);
                } else {
                    projectYard = await this.CreateProjectYard(request, queryRunner);
                }
            } else if (projectYard) {
                await this.DeleteProjectYard(projectYard, request, queryRunner);
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

            if (projectYard && projectYard.uid) {
                await SynchronizerService.dataSynchronizeManager(
                    queryRunner.manager,
                    this.projectYardTableName,
                    'uid',
                    projectYard.uid,
                    vessel.VesselId,
                );
            }
        });
    }

    private async SelectProjectYard(entity: YardsProjectsEntity, request: UpdateProjectDto, queryRunner: QueryRunner) {
        entity.is_selected = true;
        entity.yard_uid = request.ShipYardId;
        entity.updated_at = request.LastUpdated;
        entity.updated_by = request.UpdatedBy;

        await this.yardProjectsRepository.SaveProjectYard(entity, queryRunner);
    }

    private async CreateProjectYard(request: UpdateProjectDto, queryRunner: QueryRunner): Promise<YardsProjectsEntity> {
        const entity = new YardsProjectsEntity();
        entity.uid = new DataUtilService().newUid();
        entity.yard_uid = request.ShipYardId;
        entity.project_uid = request.ProjectUid;
        entity.active_status = true;
        entity.is_selected = true;
        entity.created_at = request.LastUpdated;
        entity.created_by = request.UpdatedBy;

        await this.yardProjectsRepository.SaveProjectYard(entity, queryRunner);
        return entity;
    }

    private async DeleteProjectYard(entity: YardsProjectsEntity, request: UpdateProjectDto, queryRunner: QueryRunner) {
        entity.active_status = false;
        entity.deleted_at = request.LastUpdated;
        entity.deleted_by = request.UpdatedBy;

        await this.yardProjectsRepository.SaveProjectYard(entity, queryRunner);
    }
}
