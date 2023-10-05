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
            SELECT [project_type_code] AS 'ProjectTypeCode'
            ,[project_type_name] AS 'ProjectTypeName'
        FROM [dry_dock].[project_type]
        WHERE [date_of_deletion] IS NULL
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
            SELECT [project_id] AS 'ProjectId'
            ,[project_short_code_id] AS 'ProjectShortCodeId'
            ,[created_at_office] AS 'CreatedAtOffice'
            ,[Lib_Vessels].[Vessel_Name] AS 'VesselName'
            ,[project_type_project_type_code] AS 'ProjectTypeProjectTypeCode'
            ,[project_state_project_state_code] AS 'ProjectStateProjectStateCode'
            ,[subject] AS 'Subject'
            ,[Lib_User].[First_Name] + ' ' + [Lib_User].[Last_Name] AS 'ProjectManager'
            ,[start_date] AS 'StartDate'
            ,[end_date] AS 'EndDate'
        FROM [dry_dock].[project]

        INNER JOIN [Lib_Vessels] ON [Lib_Vessels_Vessel_ID] = [Lib_Vessels].[Vessel_ID]
        INNER JOIN [Lib_User] ON [project_manager_Lib_User_Uid] = [Lib_User].[uid]

        WHERE [date_of_deletion] IS NULL
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
				[Lib_User].[Last_Name] as LastName,
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
