import { MigrationUtilsService } from "j2utils";
import {MigrationInterface, QueryRunner} from "typeorm";
import { errorLikeToString } from "../../common/drydock/ts-helpers/error-like-to-string";

export class moduleAndFunctionCodes1707456237055 implements MigrationInterface {
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
                (@MaxModuleId+2, '677D0F79-281F-4A23-A226-C61D84222A26', 'project', 'Project', 1, getdate(), NULL, NULL, 1, 'project_main', NULL, NULL)
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
                (@maxfunction_id+3, N'F808DA39-BA82-482B-90D8-912ECB41BC04', N'project', N'dry_dock', N'Dry Dock', 1, getdate(), NULL, NULL, 1, N'project', N'project_main', N'projdrydock'),
                (@maxfunction_id+4, N'9C79EF57-A1C6-40B4-A343-968976325150', N'project', N'standard_job', N'Standard Job', 1, getdate(), NULL, NULL, 1, N'project', N'project_main', N'projstandard'),
				(@maxfunction_id+5, N'660941D8-B00B-4C58-AD32-1F0A144B1C88', N'project', N'specification_details', N'Specification Details', 1, getdate(), NULL, NULL, 1, N'specification', N'project_main', N'projspec'),
                (@maxfunction_id+6, N'EA4184D7-8E4B-4898-873B-F4FE9800E499', N'project', N'project_template_index', N'Project Template', 1, getdate(), NULL, NULL, 1, N'project', N'project_main', N'projtemplate')
                )

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
                'project',
                'project module and function codes',
            );

        } catch (error) {
            await MigrationUtilsService.migrationLog(
                this.className,
                errorLikeToString(error),
                'E',
                'project',
                'project module and function codes',
                true,
            );
        }
    }
    public async down(queryRunner: QueryRunner): Promise<void> {}
}