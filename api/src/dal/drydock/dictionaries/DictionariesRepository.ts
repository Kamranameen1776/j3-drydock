import { getManager } from 'typeorm';

export class DictionariesRepository {

    public async GetVessels(): Promise<any[]> {
        const dbQuery = `
        SELECT
            vessel.[Vessel_ID] as vesselId,
            vessel.[uid] as VesselUid,
            vessel.[Vessel_Name] as VesselName
        FROM dbo.[Lib_Vessels] as vessel 
        where Date_Of_Deleted IS NULL;
        `
        
        return getManager().query(dbQuery);
    }

    public async GetManagers(): Promise<any[]> {
        const dbQuery = `
        SELECT 
            [uid]
            ,[Date_Of_Deleted]
            , [First_Name] + ' ' + [Last_Name] as ProjectManager
            
        FROM [JIBE_Main].[dbo].[LIB_USER]
        where Date_of_Deleted IS NULL;
        `
        
        return getManager().query(dbQuery);
    }

    public async GetProjectTypes(): Promise<any[]> {
        const dbQuery = `
        SELECT [id]
            ,[Worklist_Type]
            ,[short_code]
            ,[created_at]
            ,[deleted_at]
        FROM [JIBE_Main].[dry_dock].[project_type]
        where deleted_at IS NULL;
        `
        
        return getManager().query(dbQuery);
    }
}
