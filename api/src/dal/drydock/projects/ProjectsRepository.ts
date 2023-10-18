import { Request } from 'express';
import { ODataService } from 'j2utils';
import { ODataResult } from 'shared/interfaces';
import { getConnection, getManager, QueryRunner } from 'typeorm';

import { IProjectManagersResultDto } from './dtos/IProjectManagersResultDto';
import { IProjectsForMainPageRecordDto } from './dtos/IProjectsForMainPageRecordDto';
import { IProjectStatusResultDto } from './dtos/IProjectStatusResultDto';
import { IProjectTypeResultDto } from './dtos/IProjectTypeResultDto';
import { IProjectVesselsResultDto } from './dtos/IProjectVesselsResultDto';
import { CreateProjectDto } from '../../../application-layer/drydock/projects/dtos/CreateProjectDto';

import { ProjectsEntity } from '../../../entity/drydock/project'
import { UpdateProjectDto } from 'application-layer/drydock/projects/dtos/UpdateProjectDto';
import { DeleteProjectDto } from 'application-layer/drydock/projects/dtos/DeleteProjectDto';

export class ProjectsRepository {
    /**
     * Loads project statuses, that are configured in the Workflow Configurations page
     * @example In Progress, Completed, Cancelled
     * @returns Project statuses
     */
    public async GetProjectStatuses(): Promise<IProjectStatusResultDto[]> {
        const result = await getManager().query(
            `
            SELECT distinct wdetails.[WorkflowType_ID] as ProjectStatusId,
            wdetails.[status_display_name] as ProjectStatusName,
            wdetails.Workflow_OrderID
            
        FROM JMS_DTL_Workflow_config_Details as wdetails
        
        INNER JOIN TEC_LIB_Worklist_Type as wt on wdetails.Config_ID = wt.ID
        INNER JOIN [dry_dock].[project_type] as pt on pt.[Worklist_Type] = wt.Worklist_Type
        
        WHERE wt.Active_Status=1
            AND wdetails.Active_Status=1
            AND pt.[deleted_at] IS NULL
        
        ORDER BY wdetails.Workflow_OrderID
        
            `,
        );

        return result;
    }

    /**
     * Loads project types
     * @example dry_dock
     * @returns Project types
     */
    public async GetProjectTypes(): Promise<IProjectTypeResultDto[]> {
        const result = await getManager().query(
            `
            SELECT pt.[Worklist_Type] AS 'ProjectTypeCode' 
            ,wt.[Worklist_Type_Display] AS 'ProjectTypeName'
			,pt.[short_code] as 'ProjectTypeShortCode'
        FROM [dry_dock].[project_type] as pt

		INNER JOIN TEC_LIB_Worklist_Type as wt on pt.[Worklist_Type] = wt.Worklist_Type

        WHERE pt.[deleted_at] IS NULL
            `,
        );

        return result;
    }

    /**
     * Loads project states
     * @example Specification, Yard Selection, Report
     * @returns Project states
     */
    public async GetProjectStates(): Promise<undefined> {
        const result = await getManager().query(
            `
            SELECT [id]
            ,[project_state_name]
        FROM [JIBE_Main].[dry_dock].[project_state]
      
        -- TODO: pass the project type id as a parameter
        WHERE [project_type_id] = 1 
        AND [deleted_at] IS NULL
            `,
        );

        // TODO: map to the dto

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
        const oDataService = new ODataService(data, getConnection);

        const query = `
        SELECT pr.[uid] AS 'ProjectId'
        ,pr.[created_at_office] AS 'CreatedAtOffice'
        ,pr.[project_code] AS 'ProjectCode'
        ,vessel.[Vessel_Name] AS 'VesselName'
        ,wt.[Worklist_Type_Display] as ProjectTypeName			
        ,wt.[Worklist_Type] as ProjectTypeCode
        ,ps.[project_state_name] AS 'ProjectStateName'
        ,pr.[subject] AS 'Subject'
        ,usr.[First_Name] + ' ' + usr.[Last_Name] AS 'ProjectManager'
        ,usr.[uid] AS 'ProjectManagerUid'
        ,cast(pr.[start_date] as datetimeoffset) AS 'StartDate'
        ,cast(pr.[end_date] as datetimeoffset) AS 'EndDate'
    FROM [dry_dock].[project] as pr

    INNER JOIN [Lib_Vessels] as vessel ON pr.[Vessel_Id] = vessel.[Vessel_ID]
    INNER JOIN [Lib_User] as usr ON [project_manager_Uid] = usr.[uid]
    INNER JOIN [dry_dock].[project_type] as pt ON pt.[id] = pr.[project_type_id]
    INNER JOIN TEC_LIB_Worklist_Type as wt on pt.[Worklist_Type] = wt.Worklist_Type
    INNER JOIN [dry_dock].[project_state] as ps ON ps.[id] = pr.[project_state_id] 
        and pt.[id] = ps.[project_type_id]
    

    WHERE pr.[deleted_at] IS NULL
                `;

        const result = await oDataService.getJoinResult(query);

        return result;
    }

    /**
     * Loads projects managers, project managers assigned to projects
     * @returns Project managers
     */
    public async GetProjectsManagers(): Promise<IProjectManagersResultDto[]> {
        const result = await getManager().query(
            `
            SELECT
				usr.[uid] as LibUserUid,
				usr.[First_Name] as FirstName,
				usr.[Last_Name] as LastName
        FROM [dry_dock].[project] as pr

        INNER JOIN [Lib_User] as usr ON pr.[project_manager_Uid] = usr.[uid]

        WHERE pr.[deleted_at] IS NULL
            `,
        );

        return result;
    }

    /**
     * Loads projects vessels, vessels assigned to projects
     * @returns Project vessels
     */
    public async GetProjectsVessels(): Promise<IProjectVesselsResultDto[]> {
        const result = await getManager().query(
            `
            SELECT
                vessel.[uid] as LibUserUid,
				vessel.[Name] as Name,       
        FROM [dry_dock].[project] as pr

        INNER JOIN [Lib_Vessels] as vessel ON pr.[Vessel_Id] = vessel.[Vessel_ID]

        WHERE pr.[deleted_at] IS NULL
            `,
        );

        return result;
    }

    
    public async CreateProject(data: CreateProjectDto, queryRunner: QueryRunner ): Promise<any> {
        try {
            const project = new ProjectsEntity();
            project.ProjectCode = data.ProjectCode as string;
            project.CreatedAtOffice = data.CreatedAtOffice as boolean;
            project.VesselId = data.VesselId;
            project.ProjectTypeId = data.ProjectTypeId;
            project.ProjectStateId = data.ProjectStateId as number;
            project.Subject = data.Subject;
            project.ProjectManagerUid = data.ProjectManagerUid;
            project.StartDate = data.StartDate;
            project.EndDate = data.EndDate;
            
            const result = await queryRunner.manager.insert(ProjectsEntity, project)
            return 
        } catch (error) {
            throw new Error(`Method: create / Class: ProjectRepository / Error: ${error}`);
        }        
    }

    public async UpdateProject(data: UpdateProjectDto | DeleteProjectDto, queryRunner: QueryRunner ): Promise<any> {
        try {
            const result = await queryRunner.manager.update(ProjectsEntity, data.uid, data)
            return 
        } catch (error) {
            throw new Error(`Method: create / Class: ProjectRepository / Error: ${error}`);
        }        
    }
    
}
