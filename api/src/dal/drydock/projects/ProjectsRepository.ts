import { DeleteProjectDto } from 'application-layer/drydock/projects/dtos/DeleteProjectDto';
import { UpdateProjectDto } from 'application-layer/drydock/projects/dtos/UpdateProjectDto';
import { Request } from 'express';
import { ODataService } from 'j2utils';
import { ODataResult } from 'shared/interfaces';
import { getConnection, getManager, QueryRunner } from 'typeorm';

import { CreateProjectDto } from '../../../application-layer/drydock/projects/dtos/CreateProjectDto';
import { ProjectEntity } from '../../../entity/drydock/ProjectEntity';
import { ProjectTypeEntity } from '../../../entity/drydock/ProjectTypeEntity';
import { IProjectManagersResultDto } from './dtos/IProjectManagersResultDto';
import { IProjectsForMainPageRecordDto } from './dtos/IProjectsForMainPageRecordDto';
import { IProjectStatusResultDto } from './dtos/IProjectStatusResultDto';
import { IProjectTypeResultDto } from './dtos/IProjectTypeResultDto';
import { IProjectVesselsResultDto } from './dtos/IProjectVesselsResultDto';

export class ProjectsRepository {
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
                'distinct wdetails.[WorkflowType_ID] as ProjectStatusId',
                'wdetails.[status_display_name] as ProjectStatusName',
                'wdetails.Workflow_OrderID',
            ])
            .innerJoin('TEC_LIB_Worklist_Type', 'wt', 'pt.[Worklist_Type] = wt.Worklist_Type')
            .innerJoin('JMS_DTL_Workflow_config_Details', 'wdetails', 'wdetails.Config_ID = wt.ID')
            .where('pt.ActiveStatus = :activeStatus', { activeStatus: 1 })
            .andWhere('wdetails.Active_Status = :activeStatus', { activeStatus: 1 })
            .andWhere('wt.Active_Status = :activeStatus', { activeStatus: 1 })
            .orderBy('wdetails.Workflow_OrderID')
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
                'pt.WorklistType as ProjectTypeCode',
                'wt.WorklistTypeDisplay as ProjectTypeName',
                'pt.ShortCode as ProjectTypeShortCode',
            ])
            .innerJoin('TECLIBWorklistTypeEntity', 'wt', 'pt.WorklistType = wt.WorklistType')
            .where('pt.ActiveStatus = :activeStatus', { activeStatus: 1 })
            .execute();

        return result;
    }

    /**
     * Loads projects for the main page, with information
     * about the project manager, vessel, project type, project state,
     * open specifications, start date and end date
     * @param data Http request object with Odata query
     * @returns Projects for the main page
     */
    public async GetProjectsForMainPage(data: Request): Promise<ODataResult<IProjectsForMainPageRecordDto>> {
        const projectRepository = getManager().getRepository(ProjectEntity);

        const query = projectRepository
            .createQueryBuilder('pr')
            .select([
                'pr.uid AS ProjectId',
                'pr.CreatedAtOffice AS CreatedAtOffice',
                'pr.ProjectCode AS ProjectCode',
                'vessel.[Vessel_Name] AS VesselName',
                'wt.[Worklist_Type_Display] as ProjectTypeName',
                'wt.[Worklist_Type] as ProjectTypeCode',
                'ps.ProjectStateName AS ProjectStateName',
                'pr.Subject AS Subject',
                `usr.[First_Name] + ' ' + usr.[Last_Name] AS ProjectManager`,
                'usr.[uid] AS ProjectManagerUid',
                'cast(pr.StartDate as datetimeoffset) AS StartDate',
                'cast(pr.EndDate as datetimeoffset) AS EndDate',
            ])
            .innerJoin('Lib_Vessels', 'vessel', 'pr.[Vessel_Uid] = vessel.[uid]')
            .innerJoin('Lib_User', 'usr', '[project_manager_Uid] = usr.[uid]')
            .innerJoin('project_type', 'pt', 'pt.[uid] = pr.[project_type_uid]')
            .innerJoin('TEC_LIB_Worklist_Type', 'wt', 'pt.[Worklist_Type] = wt.Worklist_Type')
            .innerJoin('project_state', 'ps', 'ps.[id] = pr.[project_state_id] and pt.[uid] = ps.[project_type_uid]')
            .where('pr.ActiveStatus = 1')
            .getQuery();

        const oDataService = new ODataService(data, getConnection);

        const result = await oDataService.getJoinResult(query);

        return result;
    }

    /**
     * Loads projects managers, project managers assigned to projects
     * @returns Project managers
     */
    public async GetProjectsManagers(): Promise<IProjectManagersResultDto[]> {
        const projectRepository = getManager().getRepository(ProjectEntity);

        const result = await projectRepository
            .createQueryBuilder('pr')
            .select(['usr.[uid] as LibUserUid', 'usr.[First_Name] as FirstName', 'usr.[Last_Name] as LastName'])
            .innerJoin('Lib_User', 'usr', 'pr.[project_manager_Uid] = usr.[uid]')
            .where('pr.ActiveStatus = :activeStatus', { activeStatus: 1 })
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
            .select(['vessel.[uid] as LibUserUid', 'vessel.[Name] as Name'])
            .innerJoin('Lib_Vessels', 'vessel', 'pr.[Vessel_Uid] = vessel.[uid]')
            .where('pr.ActiveStatus = :activeStatus', { activeStatus: 1 })
            .execute();

        return result;
    }

    public async CreateProject(data: CreateProjectDto, queryRunner: QueryRunner): Promise<any> {
        try {
            const project = new ProjectEntity();
            project.ProjectCode = data.ProjectCode as string;
            project.CreatedAtOffice = data.CreatedAtOffice as boolean;
            project.VesselUid = data.VesselUid;
            project.ProjectTypeUid = data.ProjectTypeUid;
            project.ProjectStateId = data.ProjectStateId as number;
            project.Subject = data.Subject;
            project.ProjectManagerUid = data.ProjectManagerUid;
            project.StartDate = data.StartDate;
            project.EndDate = data.EndDate;

            const result = await queryRunner.manager.insert(ProjectEntity, project);
            return;
        } catch (error) {
            throw new Error(`Method: create / Class: ProjectRepository / Error: ${error}`);
        }
    }

    public async UpdateProject(data: UpdateProjectDto | DeleteProjectDto, queryRunner: QueryRunner): Promise<any> {
        try {
            const result = await queryRunner.manager.update(ProjectEntity, data.uid, data);
            return;
        } catch (error) {
            throw new Error(`Method: update-delete / Class: ProjectRepository / Error: ${error}`);
        }
    }
}
