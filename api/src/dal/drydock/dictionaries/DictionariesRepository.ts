import { getManager } from 'typeorm';

import { GetFleetsResult } from '../../../application-layer/drydock/dictionaries/get-fleets/GetFleetsResultDto';
import { LIB_FLEETS } from '../../../entity/LIB_FLEETS';

export class DictionariesRepository {
    public async GetFleets(): Promise<GetFleetsResult[]> {
        return getManager().find(LIB_FLEETS, {
            select: ['uid', 'FleetName', 'FleetCode'],
            where: {
                Active_Status: true,
            },
        });
    }

    public async GetVessels(): Promise<any[]> {
        const dbQuery = `
        SELECT
            vessel.[Vessel_ID] as vesselId,
            vessel.[uid] as VesselUid,
            vessel.[Vessel_Name] as VesselName
        FROM dbo.[Lib_Vessels] as vessel 
        where Date_Of_Deleted IS NULL;
        `;

        return getManager().query(dbQuery);
    }

    public async GetManagers(): Promise<any[]> {
        const dbQuery = `
        SELECT TOP (50)
            [uid]
            ,[Date_Of_Deleted]
            , [First_Name] + ' ' + [Last_Name] as ProjectManager
            
        FROM [JIBE_Main].[dbo].[LIB_USER]
        where Date_of_Deleted IS NULL;
        `;

        return getManager().query(dbQuery);
    }

    public async GetProjectTypes(): Promise<any[]> {
        const dbQuery = `
        SELECT [uid]
            ,[Worklist_Type]
            ,[short_code]
            ,[created_at]
            ,[active_status]
        FROM [JIBE_Main].[dry_dock].[project_type]
        where active_status = 1;
        `;

        return getManager().query(dbQuery);
    }
}
