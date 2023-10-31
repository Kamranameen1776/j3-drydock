import { getManager } from 'typeorm';

export class DictionariesRepository {

    public async GetManagers(): Promise<any[]> {
        const dbQuery = `
        SELECT [uid]
            ,[Active_Status]
			,[User_Type]
            , [First_Name] + ' ' + [Last_Name] as FullName
        FROM [JIBE_Main].[dbo].[LIB_USER]
        where Active_status = 1 and User_Type = 'OFFICE USER';
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
