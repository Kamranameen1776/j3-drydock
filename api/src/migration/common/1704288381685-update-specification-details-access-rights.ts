import { MigrationUtilsService } from "j2utils";
import {MigrationInterface, QueryRunner} from "typeorm";

export class updateSpecificationDetailsAccessRights1704288381685 implements MigrationInterface {
    public className = this.constructor.name;
    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await MigrationUtilsService.createTableBackup('inf_lib_module');
            await MigrationUtilsService.createTableBackup('INF_Lib_Function');

            await queryRunner.query(`
            DECLARE  @MaxModuleId int
            SELECT @MaxModuleId = Max(ModuleId) from inf_lib_module

            MERGE INTO inf_lib_module AS TARGET USING (
            VALUES
			(@MaxModuleId+1, 'E6F5B7C8-8F8D-47ED-BCBC-486317349373', 'project_main', 'Project', 1, getdate(), NULL, NULL, 1, NULL, NULL, NULL),
            (@MaxModuleId+2, '93A7855B-0445-4F29-978E-53D11DAFA767', 'project', 'Project', 1, getdate(), NULL, NULL, 1, 'project_main', NULL, NULL)
            )

            AS SOURCE (ModuleId, Module_UID, Module_Code, Module_Name, Created_By, Date_Of_Creation, Modified_By, Date_Of_Modification,
            Active_Status, parent_module_code, base_url,api_name)

            ON TARGET.Module_UID = SOURCE.Module_UID

            WHEN MATCHED THEN
            UPDATE SET TARGET.ModuleId = SOURCE.ModuleId, TARGET.Module_Code = SOURCE.Module_Code,
            TARGET.Module_Name = SOURCE.Module_Name, TARGET.Modified_By = 1 , TARGET.Date_Of_Modification = getDate(),
            TARGET.Active_Status = SOURCE.Active_Status, TARGET.parent_module_code = SOURCE.parent_module_code

            WHEN NOT MATCHED BY TARGET THEN
            INSERT (ModuleId, Module_UID, Module_Code, Module_Name, Created_By, Date_Of_Creation, Modified_By, Date_Of_Modification,
            Active_Status,parent_module_code, base_url, api_name)
            VALUES (SOURCE.ModuleId, SOURCE.Module_UID, SOURCE.Module_Code, SOURCE.Module_Name, SOURCE.Created_By, SOURCE.Date_Of_Creation,
            SOURCE.Modified_By, SOURCE.Date_Of_Modification, SOURCE.Active_Status, SOURCE.parent_module_code,
            SOURCE.base_url, SOURCE.api_name);
            `);

            await queryRunner.query(`
            Declare @maxfunction_id int
            Select @maxfunction_id = ISNULL(MAX(FunctionId),0)  from INF_Lib_Function
            MERGE INTO INF_Lib_Function AS TARGET USING (
            VALUES
            (@maxfunction_id+1, N'AF1C36A1-9CD0-43C4-B4E2-62F500729FD4', N'project_main', N'project', N'Project', 1, getdate(), NULL, NULL, 1, null, N'project_main', null),
			(@maxfunction_id+2, N'02F858F1-0064-4F20-A3E4-E87FB8E0FE02', N'project', N'project_index', N'Project Main', 1, getdate(), NULL, NULL, 1, 'project', N'project_main', N'proj_main'),
            (@maxfunction_id+3, N'F808DA39-BA82-482B-90D8-912ECB41BC04', N'project', N'dry_dock', N'Dry Dock', 1, getdate(), NULL, NULL, 1, N'project', N'project_main', null),
            (@maxfunction_id+4, N'9C79EF57-A1C6-40B4-A343-968976325150', N'project', N'standard_job', N'Standard Job', 1, getdate(), NULL, NULL, 1, N'project', N'project_main', null)            )

            AS SOURCE ([FunctionId], [Function_UID], [Module_Code], [Function_Code], [Function_Name], [Created_By], [Date_Of_Creation], [Modified_By], [Date_Of_Modification], [Active_Status], [parent_function_code], [parent_module_code], [attach_prefix])

            ON TARGET.[Function_UID] = SOURCE.[Function_UID]

            WHEN MATCHED THEN
            UPDATE SET TARGET.[FunctionId] = SOURCE.[FunctionId], TARGET.[Module_Code] = SOURCE.[Module_Code], TARGET.[Function_Name] = SOURCE.[Function_Name], [Modified_By] = 1, [Date_Of_Modification] = GETDATE(), TARGET.[Active_Status] = SOURCE.[Active_Status], TARGET.[parent_function_code] = SOURCE.[parent_function_code],
            TARGET.[parent_module_code] = SOURCE.[parent_module_code], TARGET.[attach_prefix] = SOURCE.[attach_prefix]

            WHEN NOT MATCHED BY TARGET THEN
            INSERT ([FunctionId], [Function_UID], [Module_Code], [Function_Code], [Function_Name], [Created_By], [Date_Of_Creation], [Modified_By], [Date_Of_Modification], [Active_Status], [parent_function_code], [parent_module_code], [attach_prefix])
            VALUES (SOURCE.[FunctionId], SOURCE.[Function_UID], SOURCE.[Module_Code], SOURCE.[Function_Code], SOURCE.[Function_Name], SOURCE.[Created_By], SOURCE.[Date_Of_Creation], SOURCE.[Modified_By], SOURCE.[Date_Of_Modification], SOURCE.[Active_Status], SOURCE.[parent_function_code],
            SOURCE.[parent_module_code], SOURCE.[attach_prefix]);
            `);

            await MigrationUtilsService.migrationLog(
                this.className,
                '',
                'S',
                'specification_details',
                'Update spec module and function',
            );
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                this.className,
                JSON.stringify(error),
                'E',
                'specification_details',
                'Update spec module and function',
                true,
            );
        }
    }
    public async down(queryRunner: QueryRunner): Promise<void> {}
}
