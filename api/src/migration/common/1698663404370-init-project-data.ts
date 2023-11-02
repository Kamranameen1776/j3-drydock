import { MigrationUtilsService } from 'j2utils';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class initProjectData1698663404370 implements MigrationInterface {
    tableName = 'project';
    schemaName = 'dry_dock';

    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.query(`
            MERGE INTO dry_dock.project_type AS TARGET USING (   
                VALUES
                ('4EED7101-6E90-4F58-9E92-3E5E17C10EFA','dry_dock','DD',getdate(),1))
                AS SOURCE ([uid],[Worklist_Type],[short_code],[created_at],[active_status])
                ON TARGET.[uid] = SOURCE.[uid]
                WHEN MATCHED THEN
                UPDATE SET TARGET.[Worklist_Type] = SOURCE.[Worklist_Type], TARGET.[short_code] = SOURCE.[short_code], 
                            TARGET.[created_at] = SOURCE.[created_at], TARGET.[active_status] = SOURCE.[active_status]
                        
                WHEN NOT MATCHED BY TARGET THEN
                INSERT ([uid],[Worklist_Type],[short_code],[created_at],[active_status])
                VALUES (SOURCE.[uid], SOURCE.[Worklist_Type], SOURCE.[short_code], 
                        SOURCE.[created_at], SOURCE.[active_status]); 
                        

            MERGE INTO dry_dock.project_state AS TARGET USING (   
                            VALUES
                            ('Specification', getdate(), 1, '4EED7101-6E90-4F58-9E92-3E5E17C10EFA'),
                            ('Yard Selection', getdate(), 1, '4EED7101-6E90-4F58-9E92-3E5E17C10EFA'),
                            ('Report', getdate(), 1, '4EED7101-6E90-4F58-9E92-3E5E17C10EFA'))
                            AS SOURCE ([project_state_name],[created_at],[active_status],[project_type_uid])
                            ON TARGET.[project_state_name] = SOURCE.[project_state_name]
                            WHEN MATCHED THEN
                            UPDATE SET  TARGET.[created_at] = SOURCE.[created_at], 
                                        TARGET.[active_status] = SOURCE.[active_status], TARGET.[project_type_uid] = SOURCE.[project_type_uid]
                                    
                            WHEN NOT MATCHED BY TARGET THEN
                            INSERT ([project_state_name],[created_at],[active_status],[project_type_uid])
                            VALUES (SOURCE.[project_state_name], SOURCE.[created_at], 
                                    SOURCE.[active_status], SOURCE.[project_type_uid]); 

            MERGE INTO inf_lib_function AS TARGET USING (   
                            VALUES
                            (3137,NEWID(),'tm_drydock','tm_drydock_project','Project Dry Dock',1, getdate(),1,'tm_drydock'))
                            AS SOURCE ([FunctionId],[Function_UID],[Module_Code],[Function_Code],[Function_Name],[Created_By],[Date_Of_Creation],[Active_Status],[parent_module_code])
                            ON TARGET.[Function_Code] = SOURCE.[Function_Code]
                            WHEN MATCHED THEN
                            UPDATE SET TARGET.FunctionId = SOURCE.FunctionId, TARGET.Function_UID = SOURCE.Function_UID, 
                                        TARGET.[Module_Code] = SOURCE.[Module_Code], TARGET.[Function_Name] = SOURCE.[Function_Name], 
                                        TARGET.[Created_By] = SOURCE.[Created_By], TARGET.Modified_By = 1, 
                                        TARGET.Date_Of_Modification = getdate()  ,TARGET.Active_Status = SOURCE.[Active_Status], 
                                        TARGET.[parent_module_code] = SOURCE.[parent_module_code]
                            WHEN NOT MATCHED BY TARGET THEN
                            INSERT ([FunctionId],[Function_UID],[Module_Code],[Function_Code],[Function_Name],[Created_By],[Date_Of_Creation],[Active_Status],[parent_module_code])
                            VALUES (SOURCE.[FunctionId], SOURCE.[Function_UID], SOURCE.[Module_Code], 
                                    SOURCE.[Function_Code], SOURCE.[Function_Name], SOURCE.[Created_By], 
                                    SOURCE.[Date_Of_Creation], SOURCE.[Active_Status], SOURCE.[parent_module_code]);
            `);

            await MigrationUtilsService.migrationLog(
                'initProjectData1698663404370',
                '',
                'S',
                'dry_dock',
                'Init Project Data',
            );
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                'initProjectData1698663404370',
                JSON.stringify(error),
                'E',
                'dry_dock',
                'Init Project Data',
                true,
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        try {
            await MigrationUtilsService.migrationLog(
                'initProjectData1698663404370',
                '',
                'S',
                'dry_dock',
                'Init Project Data (Down migration)',
            );
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                'initProjectData1698663404370',
                JSON.stringify(error),
                'E',
                'dry_dock',
                'Init Project Data (Down migration)',
                true,
            );
        }
    }
}
