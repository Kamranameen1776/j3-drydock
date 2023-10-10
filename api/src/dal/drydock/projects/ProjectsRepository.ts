import { getManager } from 'typeorm';

import { ProjectState } from '../../../bll/drydock/entities/ProjectState';
import { ProjectType } from '../../../bll/drydock/entities/ProjectType';
import { GetProjectManagersResultDto } from './dtos/GetProjectManagersResultDto';
import { GetProjectsForMainPageResultDto } from './dtos/GetProjectsForMainPageResultDto';
import { GetProjectVesselsResultDto } from './dtos/GetProjectVesselsResultDto';

export class ProjectsRepository {
    public async GetProjectTypes(): Promise<ProjectType[]> {
        const result = await getManager().query(
            `
            SELECT pt.[project_type_code] AS 'ProjectTypeCode' 
            ,wt.[Worklist_Type_Display] AS 'ProjectTypeName'
			,pt.[short_code] as 'ProjectTypeShortCode'
        FROM [dry_dock].[project_type] as pt

		INNER JOIN TEC_LIB_Worklist_Type as wt on pt.[project_type_code] = wt.Worklist_Type

        WHERE pt.[date_of_deletion] IS NULL
            `,
        );

        return result;
    }

    public async GetProjectStates(): Promise<ProjectState[]> {
        const result = await getManager().query(
            `
            SELECT [project_state_code] AS 'ProjectStateCode'
            ,[project_state_name] AS 'ProjectStateName'
        FROM [dry_dock].[project_state]
        WHERE [date_of_deletion] IS NULL
            `,
        );

        return result;
    }

    public async GetProjectsForMainPage(): Promise<GetProjectsForMainPageResultDto[]> {
        const result = await getManager().query(
            `
            SELECT pr.[project_id] AS 'ProjectId'
            ,pr.[project_code] AS 'ProjectCode'
            ,vessel.[Vessel_Name] AS 'VesselName'
			,wt.[Worklist_Type_Display] as ProjectTypeName
            ,pr.[project_state_code] AS 'ProjectStateCode'
            ,pr.[subject] AS 'Subject'
            ,usr.[First_Name] + ' ' + usr.[Last_Name] AS 'ProjectManager'
            ,cast(pr.[start_date] as datetimeoffset) AS 'StartDate'
            ,cast(pr.[end_date] as datetimeoffset) AS 'EndDate'
        FROM [dry_dock].[project] as pr

        INNER JOIN [Lib_Vessels] as vessel ON [Lib_Vessels_Vessel_ID] = vessel.[Vessel_ID]
        INNER JOIN [Lib_User] as usr ON [project_manager_Lib_User_Uid] = usr.[uid]
		INNER JOIN TEC_LIB_Worklist_Type as wt on pr.[project_type_code] = wt.Worklist_Type

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
