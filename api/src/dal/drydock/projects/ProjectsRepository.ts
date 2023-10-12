import { Request } from 'express';
import { ODataService } from 'j2utils';
import { getConnection, getManager } from 'typeorm';

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
        INNER JOIN [dry_dock].[project_type] as pt on pt.[Worklist_Type] = wt.Worklist_Type
        
        WHERE wt.Active_Status=1
            AND wdetails.Active_Status=1
            AND pt.[deleted_at] IS NULL
        
        ORDER BY wdetails.Workflow_OrderID
        
            `,
        );

        return result;
    }

    public async GetProjectTypes(): Promise<ProjectTypeResultDto[]> {
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

    public async GetProjectStates(): Promise<any[]> {
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

    public async GetProjectsForMainPage(data: Request): Promise<GetProjectsForMainPageResultDto> {
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

    public async GetProjectsManagers(): Promise<GetProjectManagersResultDto[]> {
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

    public async GetProjectsVessels(): Promise<GetProjectVesselsResultDto[]> {
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
}
