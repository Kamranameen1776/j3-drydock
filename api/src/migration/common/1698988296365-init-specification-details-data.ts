import { MigrationUtilsService } from 'j2utils';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSpecificationDetailsData1698988296365 implements MigrationInterface {
    public className = this.constructor.name;
    public schemaName = 'dry_dock';

    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await MigrationUtilsService.createTableBackup('TEC_LIB_Worklist_Type');
            await MigrationUtilsService.createTableBackup('INF_Lib_Module');
            await MigrationUtilsService.createTableBackup('inf_lib_function');
            await queryRunner.query(`
            MERGE INTO TEC_LIB_Worklist_Type AS TARGET USING (   
            VALUES
            (159,'dry_dock_spec','Dry Dock Spec',1,getdate(),1,0, 'SPEC',NEWID()))
            AS SOURCE ([ID],[Worklist_Type],[Worklist_Type_Display],[Created_By],[Date_Of_Creation],[Active_Status],[Is_Child_Task],[job_card_prefix],[uid])
            ON TARGET.[Worklist_Type] = SOURCE.[Worklist_Type]
            WHEN MATCHED THEN
            UPDATE SET TARGET.[Worklist_Type_Display] = SOURCE.[Worklist_Type_Display], TARGET.[Active_Status] = SOURCE.[Active_Status], 
                        TARGET.[Is_Child_Task] = SOURCE.[Is_Child_Task], TARGET.[job_card_prefix] = SOURCE.[job_card_prefix], 
                        TARGET.Modified_By = 1, TARGET.Date_Of_Modification = getdate()  
            WHEN NOT MATCHED BY TARGET THEN
            INSERT ([ID],[Worklist_Type],[Worklist_Type_Display],[Created_By],[Date_Of_Creation],[Active_Status],[Is_Child_Task],[job_card_prefix],[uid])
            VALUES (SOURCE.[ID], SOURCE.[Worklist_Type], SOURCE.[Worklist_Type_Display], 
                    SOURCE.[Created_By], SOURCE.[Date_Of_Creation], SOURCE.[Active_Status], 
                    SOURCE.[Is_Child_Task], SOURCE.[job_card_prefix], SOURCE.[uid]);
    

                    MERGE INTO INF_Lib_Module AS TARGET USING (   
                            VALUES
                            (243,NEWID(),'tm_drydock_spec','Spec Dry Dock',1,getdate(),NULL,NULL,1,'tm_drydock'))
                            AS SOURCE ([ModuleId],[Module_UID],[Module_Code],[Module_Name],[Created_By],[Date_Of_Creation],[Modified_By], 
                                        [Date_Of_Modification],[Active_Status],[parent_module_code])
                            ON TARGET.[Module_Code] = SOURCE.[Module_Code]
                            WHEN MATCHED THEN
                            UPDATE SET TARGET.ModuleId = SOURCE.ModuleId, TARGET.Module_UID = SOURCE.Module_UID, 
                                        TARGET.Module_Name = SOURCE.Module_Name, TARGET.Created_By = SOURCE.Created_By, 
                                        TARGET.Date_Of_Creation = SOURCE.Date_Of_Creation, TARGET.Modified_By = 1, 
                                        TARGET.Date_Of_Modification = getdate()  ,TARGET.Active_Status = SOURCE.Active_Status, 
                                        TARGET.parent_module_code = SOURCE.parent_module_code
                            WHEN NOT MATCHED BY TARGET THEN
                            INSERT ([ModuleId], [Module_UID], [Module_Code], [Module_Name], 
                                    [Created_By], [Date_Of_Creation], [Modified_By], [Date_Of_Modification], 
                                    [Active_Status], [parent_module_code])
                            VALUES (SOURCE.[ModuleId], SOURCE.[Module_UID], SOURCE.[Module_Code], 
                                    SOURCE.[Module_Name], SOURCE.[Created_By], SOURCE.[Date_Of_Creation], 
                                    SOURCE.[Modified_By], SOURCE.[Date_Of_Modification], SOURCE.[Active_Status], SOURCE.[parent_module_code]); 

            MERGE INTO inf_lib_function AS TARGET USING (   
            VALUES
            (3138,NEWID(),'tm_drydock_spec','tm_drydock_spec','Spec Dry Dock',1, getdate(),1,'tm_drydock_spec'))
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
                'initSpecificationDetailsData16989882964366',
                '',
                'S',
                'dry_dock',
                'Init Specification Details Data',
            );
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                'initSpecificationDetailsData16989882964366',
                JSON.stringify(error),
                'E',
                'dry_dock',
                'Init Specification Details Data',
                true,
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        try {
            await MigrationUtilsService.migrationLog(
                'initSpecificationDetailsData16989882964366',
                '',
                'S',
                'dry_dock',
                'Init Specification Details Data (Down migration)',
            );
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                'initSpecificationDetailsData16989882964366',
                JSON.stringify(error),
                'E',
                'dry_dock',
                'Init Specification Details Data (Down migration)',
                true,
            );
        }
    }
}
