import { getManager } from 'typeorm';

import { GetProjectManagersResultDto } from './dtos/GetProjectManagersResultDto';
import { GetProjectsForMainPageResultDto } from './dtos/GetProjectsForMainPageResultDto';
import { GetProjectVesselsResultDto } from './dtos/GetProjectVesselsResultDto';
import { ProjectStatusResultDto } from './dtos/ProjectStatusResultDto';
import { ProjectTypeResultDto } from './dtos/ProjectTypeResultDto';

export class ProjectsRepository {
    public async GetProjectStatuses(): Promise<ProjectStatusResultDto[]> {
        const result = await getManager().query(
            `
            SELECT distinct wdetails.[WorkflowType_ID] as ProjectStatusId,
            wdetails.[status_display_name] as ProjectStatusName,
            wdetails.Workflow_OrderID
            
        FROM JMS_DTL_Workflow_config_Details as wdetails
        
        INNER JOIN TEC_LIB_Worklist_Type as wt on wdetails.Config_ID = wt.ID
        INNER JOIN [dry_dock].[project_type] as pt on pt.[TEC_LIB_Worklist_Type] = wt.Worklist_Type
        
        WHERE wt.Active_Status=1
            AND wdetails.Active_Status=1
            AND pt.[date_of_deletion] IS NULL
        
        ORDER BY wdetails.Workflow_OrderID
        
            `,
        );

        return result;
    }

    public async GetProjectTypes(): Promise<ProjectTypeResultDto[]> {
        const result = await getManager().query(
            `
            SELECT pt.[TEC_LIB_Worklist_Type] AS 'ProjectTypeCode' 
            ,wt.[Worklist_Type_Display] AS 'ProjectTypeName'
			,pt.[short_code] as 'ProjectTypeShortCode'
        FROM [dry_dock].[project_type] as pt

		INNER JOIN TEC_LIB_Worklist_Type as wt on pt.[TEC_LIB_Worklist_Type] = wt.Worklist_Type

        WHERE pt.[date_of_deletion] IS NULL
            `,
        );

        return result;
    }

    public async GetProjectStates(): Promise<any[]> {
        const result = await getManager().query(
            `
            SELECT [project_state_id]
            ,[project_state_name]
        FROM [JIBE_Main].[dry_dock].[project_state]
      
        -- TODO: pass the project type id as a parameter
        WHERE [project_type_id] = 1 
        AND [date_of_deletion] IS NULL
            `,
        );

        // TODO: map to the dto

        return result;
    }

    public async GetProjectsForMainPage(): Promise<GetProjectsForMainPageResultDto[]> {
        const result = await getManager().query(
            `
            SELECT pr.[project_id] AS 'ProjectId'
            ,pr.[created_at_office] AS 'CreatedAtOffice'
            ,pr.[project_code] AS 'ProjectCode'
            ,vessel.[Vessel_Name] AS 'VesselName'
			,wt.[Worklist_Type_Display] as ProjectTypeName
            ,ps.[project_state_name] AS 'ProjectStateName'
            ,pr.[subject] AS 'Subject'
            ,usr.[First_Name] + ' ' + usr.[Last_Name] AS 'ProjectManager'
            ,cast(pr.[start_date] as datetimeoffset) AS 'StartDate'
            ,cast(pr.[end_date] as datetimeoffset) AS 'EndDate'
        FROM [dry_dock].[project] as pr

        INNER JOIN [Lib_Vessels] as vessel ON [Lib_Vessels_Vessel_ID] = vessel.[Vessel_ID]
        INNER JOIN [Lib_User] as usr ON [project_manager_Lib_User_Uid] = usr.[uid]
		INNER JOIN [dry_dock].[project_type] as pt ON pt.[project_type_id] = pr.[project_type_id]
		INNER JOIN TEC_LIB_Worklist_Type as wt on pt.[TEC_LIB_Worklist_Type] = wt.Worklist_Type
		INNER JOIN [dry_dock].[project_state] as ps ON ps.[project_state_id] = pr.[project_state_id] 
			and pt.[project_type_id] = ps.[project_type_id]
		

        WHERE pr.[date_of_deletion] IS NULL
            `,
        );

        return result;
    }

    public async GetProjectsManagers(): Promise<GetProjectManagersResultDto[]> {
        const result = await getManager().query(
            `
            SELECT
				[Lib_User].[uid] as LibUserUid,
				[Lib_User].[First_Name] as FirstName,
				[Lib_User].[Last_Name] as LastName
        FROM [dry_dock].[project]

        INNER JOIN [Lib_User] ON [project_manager_Lib_User_Uid] = [Lib_User].[uid]

        WHERE [dry_dock].[project].[date_of_deletion] IS NULL
            `,
        );

        return result;
    }

    public async GetProjectsVessels(): Promise<GetProjectVesselsResultDto[]> {
        const result = await getManager().query(
            `
            SELECT
				[Lib_Vessels].[uid] as LibUserUid,
				[Lib_Vessels].[Name] as Name,
        FROM [dry_dock].[project]

        INNER JOIN [Lib_Vessels] ON [Lib_Vessels_Vessel_ID] = [Lib_Vessels].[Vessel_ID]

        WHERE [dry_dock].[project].[date_of_deletion] IS NULL
            `,
        );

        return result;
    }
}
