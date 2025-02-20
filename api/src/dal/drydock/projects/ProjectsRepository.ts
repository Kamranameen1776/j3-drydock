// TODO: remove references to application-layer
// UpdateProjectDto should be a part of the Infrastructure layer(DAL)
import { Request } from 'express';
import { DataUtilService, ODataService } from 'j2utils';
import { getConnection, getManager, QueryRunner, SelectQueryBuilder } from 'typeorm';

import { className } from '../../../common/drydock/ts-helpers/className';
import { J3PrcCompanyRegistryEntity, SpecificationDetailsEntity, YardsProjectsEntity } from '../../../entity/drydock';
import { JmsDtlWorkflowConfigDetailsEntity } from '../../../entity/drydock/dbo/JMSDTLWorkflowConfigDetailsEntity';
import { JmsDtlWorkflowConfigEntity } from '../../../entity/drydock/dbo/JMSDTLWorkflowConfigEntity';
import { LibUserEntity } from '../../../entity/drydock/dbo/LibUserEntity';
import { LibVesselsEntity } from '../../../entity/drydock/dbo/LibVesselsEntity';
import { TecLibWorklistTypeEntity } from '../../../entity/drydock/dbo/TECLIBWorklistTypeEntity';
import { TecTaskManagerEntity } from '../../../entity/drydock/dbo/TECTaskManagerEntity';
import { GroupProjectStatusEntity } from '../../../entity/drydock/GroupProjectStatusEntity';
import { ProjectEntity } from '../../../entity/drydock/ProjectEntity';
import { ProjectStateEntity } from '../../../entity/drydock/ProjectStateEntity';
import { ProjectTypeEntity } from '../../../entity/drydock/ProjectTypeEntity';
import { TaskManagerConstants } from '../../../shared/constants';
import { ODataResult } from '../../../shared/interfaces/odata-result.interface';
import { ICreateNewProjectDto } from './dtos/ICreateNewProjectDto';
import { IGroupProjectStatusesRawDataDto } from './dtos/IGroupProjectStatusDto';
import { IProjectsForMainPageRecordDto } from './dtos/IProjectsForMainPageRecordDto';
import { IProjectsManagersResultDto } from './dtos/IProjectsManagersResultDto';
import { IProjectStatusResultDto } from './dtos/IProjectStatusResultDto';
import { IProjectTypeResultDto } from './dtos/IProjectTypeResultDto';
import { IProjectVesselsResultDto } from './dtos/IProjectVesselsResultDto';

export class ProjectsRepository {
    public async GetGroupStatusesRawData(assignedVessels?: number[]): Promise<IGroupProjectStatusesRawDataDto[]> {
        const groupProjectStatusRepository = getManager().getRepository(GroupProjectStatusEntity);

        let firstQuery = getManager()
            .createQueryBuilder()
            .select([
                'count(prs.ProjectId) as counter',
                'gps.GroupProjectStatusId as GroupProjectStatusId',
                'gps.ProjectTypeId as ProjectTypeId',
            ])
            .from(`(${this.GetQueryForProjects().getQuery()})`, 'prs')
            .innerJoin(className(ProjectTypeEntity), 'pt', 'pt.uid = prs.ProjectTypeUid')
            .innerJoin(
                className(GroupProjectStatusEntity),
                'gps',
                'prs.ProjectStatusId = gps.ProjectStatusId and pt.WorklistType = gps.ProjectTypeId',
            )
            .innerJoin(className(LibVesselsEntity), 'vessel', 'prs.VesselUid = vessel.uid')
            .groupBy('gps.GroupProjectStatusId, gps.ProjectTypeId')
            .where('gps.ActiveStatus = 1');

        if (assignedVessels) {
            firstQuery = firstQuery.andWhere(`vessel.vessel_id IN (${assignedVessels.join(',')})`);
        }

        const secondQuery = groupProjectStatusRepository
            .createQueryBuilder('t1')
            .select([
                't1.GroupProjectStatusId as GroupProjectStatusId',
                't1.ProjectTypeId as ProjectTypeId',
                't1.DisplayName as GroupProjectDisplayName',
                'ISNULL(t2.counter, 0) as ProjectWithStatusCount',
                'wt.WorklistTypeDisplay as ProjectTypeName',
                't1.StatusOrder as StatusOrder',
            ])
            .leftJoin(
                `(${firstQuery.getQuery()})`,
                't2',
                't1.GroupProjectStatusId = t2.GroupProjectStatusId and t1.ProjectTypeId = t2.ProjectTypeId',
            )
            .innerJoin(className(TecLibWorklistTypeEntity), 'wt', 't1.ProjectTypeId = wt.WorklistType')
            .where('t1.ActiveStatus = 1')
            .groupBy(
                `t1.GroupProjectStatusId, t1.ProjectTypeId,
                t1.DisplayName, counter,
                t1.StatusOrder, wt.WorklistTypeDisplay`,
            )
            .orderBy('t1.StatusOrder', 'ASC');

        const result = await secondQuery.execute();
        return result;
    }

    public async GetGroupStatusesAsyncRawData(): Promise<IGroupProjectStatusesRawDataDto[]> {
        const groupProjectStatusRepository = getManager().getRepository(GroupProjectStatusEntity);

        const query = groupProjectStatusRepository
            .createQueryBuilder('gps')
            .select([
                'gps.GroupProjectStatusId as GroupProjectStatusId',
                'gps.ProjectTypeId as ProjectTypeId',
                'gps.DisplayName as GroupProjectDisplayName',
                'wt.WorklistTypeDisplay as ProjectTypeName',
                'gps.StatusOrder as StatusOrder',
            ])
            .innerJoin(className(TecLibWorklistTypeEntity), 'wt', 'gps.ProjectTypeId = wt.WorklistType')
            .where('gps.ActiveStatus = 1')
            .groupBy(
                `gps.GroupProjectStatusId, gps.ProjectTypeId,
                gps.DisplayName,
                gps.StatusOrder, wt.WorklistTypeDisplay`,
            )
            .orderBy('gps.StatusOrder', 'ASC');

        const result = await query.execute();
        return result;
    }
    /**
     * Loads project statuses, that are configured in the Workflow Configurations page
     * @example In Progress, Completed, Cancelled
     * @returns Project statuses
     */
    public async GetProjectStatuses(): Promise<IProjectStatusResultDto[]> {
        const projectTypeRepository = getManager().getRepository(ProjectTypeEntity);

        const result = await projectTypeRepository
            .createQueryBuilder('pt')
            .select([
                'wdetails.WorkflowTypeID as ProjectStatusId',
                'wdetails.StatusDisplayName as ProjectStatusName',
                'wdetails.WorkflowOrderID',
            ])
            .innerJoin(className(JmsDtlWorkflowConfigEntity), 'wc', 'wc.job_type = pt.WorklistType')
            .innerJoin(className(JmsDtlWorkflowConfigDetailsEntity), 'wdetails', 'wdetails.ConfigId = wc.ID')
            .where('pt.ActiveStatus = :activeStatus', { activeStatus: 1 })
            .andWhere('wdetails.ActiveStatus = :activeStatus', { activeStatus: 1 })
            .andWhere('wc.ActiveStatus = :activeStatus', { activeStatus: 1 })
            .distinct(true)
            .distinctOn(['wdetails.WorkflowTypeID'])
            .orderBy('wdetails.WorkflowOrderID')
            .execute();

        return result;
    }
    /**
     * Loads project types
     * @example dry_dock
     * @returns Project types
     */
    public async GetProjectTypes(): Promise<IProjectTypeResultDto[]> {
        const projectTypeRepository = getManager().getRepository(ProjectTypeEntity);

        const result = await projectTypeRepository
            .createQueryBuilder('pt')
            .select([
                'pt.uid as ProjectTypeUId',
                'pt.WorklistType as ProjectTypeCode',
                'wt.WorklistTypeDisplay as ProjectTypeName',
                'pt.ShortCode as ProjectTypeShortCode',
            ])
            .innerJoin(className(TecLibWorklistTypeEntity), 'wt', 'pt.WorklistType = wt.WorklistType')
            .where('pt.ActiveStatus = :activeStatus', { activeStatus: 1 })
            .execute();

        return result;
    }

    private getSpecificationCountQuery(qb: SelectQueryBuilder<SpecificationDetailsEntity>, uid?: string) {
        let query = qb
            .select(['sd.uid as uid', 'stm.Status as status', 'project_uid as ProjectUid'])
            .from(className(SpecificationDetailsEntity), 'sd')
            .innerJoin(className(TecTaskManagerEntity), 'stm', `stm.uid = sd.tec_task_manager_uid`);

        if (uid) {
            query = query.where('sd.project_uid = :uid AND sd.active_status = 1', { uid });
        } else {
            query = query.where('sd.active_status = 1');
        }

        return query.groupBy(['sd.uid', 'stm.task_status', 'sd.project_uid'].join(','));
    }

    private GetQueryForProjects(uid?: string, assignedVessels?: number[]): SelectQueryBuilder<ProjectEntity> {
        const projectRepository = getManager().getRepository(ProjectEntity);

        let query = projectRepository
            .createQueryBuilder('pr')
            .select([
                'pr.uid AS ProjectId',
                'pr.CreatedAtOffice AS CreatedAtOffice',
                'tm.Code AS ProjectCode',
                'tm.Status as ProjectStatusId',
                'wdetails.StatusDisplayName as ProjectStatusName',
                'vessel.VesselName AS VesselName',
                'wt.WorklistTypeDisplay as ProjectTypeName',
                'wt.WorklistType as ProjectTypeCode',
                'ps.ProjectStateName AS ProjectStateName',
                'pr.Subject AS Subject',
                `usr.FirstName + ' ' + usr.LastName AS ProjectManager`,
                'usr.uid AS ProjectManagerUid',
                'cast(pr.StartDate as datetimeoffset) AS StartDate',
                'cast(pr.EndDate as datetimeoffset) AS EndDate',
                'gps.GroupProjectStatusId as GroupProjectStatusId',
                'vessel.VesselId as VesselId',
                'vessel.VesselType as VesselType',
                'pr.VesselUid as VesselUid',
                'vessel.FleetCode as FleetCode',
                'pr.TaskManagerUid as TaskManagerUid',
                'yd.registeredName as ShipYard',
                'yd.uid as ShipYardUid',
                'pr.ProjectTypeUid as ProjectTypeUid',
                `CONCAT(COUNT(CASE WHEN sc.status = '${TaskManagerConstants.specification.status.Closed}' THEN 1 END), '/', COUNT(sc.uid)) AS Specification`,
            ])
            .leftJoin((qb) => this.getSpecificationCountQuery(qb, uid), 'sc', 'sc.projectUid = pr.uid')
            .leftJoin(
                className(YardsProjectsEntity),
                'ydp',
                'ydp.project_uid = pr.uid and ydp.is_selected = 1 and ydp.active_status = 1',
            )
            .leftJoin(className(J3PrcCompanyRegistryEntity), 'yd', 'yd.uid = ydp.yard_uid')
            .innerJoin(className(LibVesselsEntity), 'vessel', 'pr.VesselUid = vessel.uid')
            .leftJoin(className(LibUserEntity), 'usr', 'pr.ProjectManagerUid = usr.uid')
            .innerJoin(className(ProjectTypeEntity), 'pt', 'pt.uid = pr.ProjectTypeUid')
            .innerJoin(className(TecLibWorklistTypeEntity), 'wt', 'pt.WorklistType = wt.WorklistType')
            .innerJoin(className(ProjectStateEntity), 'ps', 'ps.id = pr.ProjectStateId and pt.uid = ps.ProjectTypeUid')
            .innerJoin(className(TecTaskManagerEntity), 'tm', 'tm.uid = pr.TaskManagerUid')
            .innerJoin(className(JmsDtlWorkflowConfigEntity), 'wc', 'wc.job_type = pt.WorklistType')
            .innerJoin(
                className(JmsDtlWorkflowConfigDetailsEntity),
                'wdetails',
                'wdetails.ConfigId = wc.ID AND wdetails.WorkflowTypeID = tm.Status AND wdetails.ActiveStatus = 1 AND tm.raised_location = wdetails.Is_Office',
            )
            .innerJoin(
                className(GroupProjectStatusEntity),
                'gps',
                `gps.ProjectTypeId = pt.WorklistType
                    and gps.ProjectStatusId = tm.Status
                    `,
            )
            .where('pr.ActiveStatus = 1')
            .groupBy(
                [
                    '"pr"."uid"',
                    'pr.created_at_office',
                    'tm.job_card_no',
                    'tm.task_status',
                    'wdetails.status_display_name',
                    'vessel.vessel_name',
                    'wt.worklist_type_display',
                    'wt.worklist_type',
                    'ps.project_state_name',
                    'pr.subject',
                    `usr.first_name + ' ' + usr.last_name`,
                    '"usr"."uid"',
                    'cast(pr.start_date as datetimeoffset)',
                    'cast(pr.end_date as datetimeoffset)',
                    'gps.group_status_id',
                    'vessel.vessel_id',
                    'pr.vessel_uid',
                    'vessel.FleetCode',
                    'vessel.Vessel_type',
                    'pr.task_manager_uid',
                    'yd.registered_name',
                    '"yd"."uid"',
                    'pr.project_type_uid',
                    'sc.projectUid',
                ].join(','),
            )
            .distinct(true)
            .distinctOn(['pr.uid']);

        if (uid) {
            query = query.andWhere('pr.uid = :uid', { uid });
        }
        if (assignedVessels) {
            query = query.andWhere('vessel.vessel_id IN (:...ids)', { ids: assignedVessels });
        }
        return query;
    }

    public async GetProject(uid: string): Promise<Array<IProjectsForMainPageRecordDto>> {
        const query = this.GetQueryForProjects(uid);
        return query.execute();
    }

    /**
     * Loads projects for the main page, with information
     * about the project manager, vessel, project type, project state,
     * open specifications, start date and end date
     * @param data Http request object with Odata query
     * @returns Projects for the main page
     */
    public async GetProjectsForMainPage(
        data: Request,
        assignedVessels: number[],
    ): Promise<ODataResult<IProjectsForMainPageRecordDto>> {
        const oDataService = new ODataService(data, getConnection);

        const [query, params] = this.GetQueryForProjects(undefined, assignedVessels).getQueryAndParameters();
        const result = await oDataService.getJoinResult(query, params);

        return result;
    }

    /**
     * Loads projects managers, project managers assigned to projects
     * @returns Project managers
     */
    public async GetProjectsManagers(): Promise<IProjectsManagersResultDto[]> {
        const projectRepository = getManager().getRepository(ProjectEntity);

        const result = await projectRepository
            .createQueryBuilder('pr')
            .select(['usr.uid as ManagerId', `usr.FirstName + ' ' + usr.LastName as FullName`])
            .innerJoin(className(LibUserEntity), 'usr', 'pr.ProjectManagerUid = usr.uid')
            .where('pr.ActiveStatus = :activeStatus', { activeStatus: 1 })
            .orderBy('FullName')
            .distinct(true)
            .distinctOn(['usr.uid'])
            .execute();

        return result;
    }

    /**
     * Loads projects vessels, vessels assigned to projects
     * @returns Project vessels
     */
    public async GetProjectsVessels(): Promise<IProjectVesselsResultDto[]> {
        const projectRepository = getManager().getRepository(ProjectEntity);

        const result = await projectRepository
            .createQueryBuilder('pr')
            .select(['vessel.uid as VesselUid', 'vessel.VesselName as Name'])
            .innerJoin(className(LibVesselsEntity), 'vessel', 'pr.VesselUid = vessel.uid')
            .where('pr.ActiveStatus = :activeStatus', { activeStatus: 1 })
            .execute();

        return result;
    }

    public async CreateProject(data: ICreateNewProjectDto, queryRunner: QueryRunner): Promise<string> {
        const project = new ProjectEntity();
        project.uid = data.uid ?? new DataUtilService().newUid();
        project.CreatedAtOffice = !!data.CreatedAtOffice;
        project.VesselUid = data.VesselUid;
        project.ProjectTypeUid = data.ProjectTypeUid;
        project.ProjectStateId = data.ProjectStateId as number;
        project.Subject = data.Subject;
        project.ProjectManagerUid = data.ProjectManagerUid;
        project.StartDate = data.StartDate;
        project.EndDate = data.EndDate;
        project.TaskManagerUid = data.TaskManagerUid as string;

        await queryRunner.manager.insert(ProjectEntity, project);
        return project.uid;
    }

    public async SaveProject(project: ProjectEntity, queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.save(project);
    }

    public async DeleteProject(projectId: string, queryRunner: QueryRunner): Promise<void> {
        const project = new ProjectEntity();
        project.uid = projectId;
        project.ActiveStatus = false;

        await queryRunner.manager.update(ProjectEntity, project.uid, project);
    }

    public async TryGetProjectByUid(uid: string): Promise<ProjectEntity | undefined> {
        const projectRepository = getManager().getRepository(ProjectEntity);

        const project = await projectRepository.findOne({
            where: {
                uid,
                ActiveStatus: true,
            },
        });

        return project;
    }
}
