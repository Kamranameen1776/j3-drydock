import { MigrationUtilsService } from 'j2utils';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class v3234213DryDockAndStandardJobAccessRights1700745113232 implements MigrationInterface {
    public className = this.constructor.name;
    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await MigrationUtilsService.createTableBackup('INF_Lib_Module');
            await MigrationUtilsService.createTableBackup('inf_lib_function');
            await MigrationUtilsService.createTableBackup('INF_LIB_Right');

            await queryRunner.query(`
            DECLARE  @MaxModuleId int 
            SELECT @MaxModuleId = Max(ModuleId) from inf_lib_module
            
            MERGE INTO inf_lib_module AS TARGET USING (
            VALUES
            (@MaxModuleId+1, '16FCFB3E-B60B-4B11-B43A-E3308C55B756', 'crew', 'Crewing', 1, getdate(), NULL, NULL, 1, NULL, 'https://j3-dev.jibe.solutions/api/crew', NULL),
            (@MaxModuleId+2, '93A7855B-0445-4F29-978E-53D11DAFA767', 'project', 'Project', 1, getdate(), NULL, NULL, 1, 'crew', NULL, NULL)
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
            (@maxfunction_id+1, N'02F858F1-0064-4F20-A3E4-E87FB8E0FE02', N'project', N'project_index', N'Project Main', 1, getdate(), NULL, NULL, 1, 'project', N'crew', N'proj_main'),               
            (@maxfunction_id+2, N'AF1C36A1-9CD0-43C4-B4E2-62F500729FD4', N'crew', N'project', N'Project', 1, getdate(), NULL, NULL, 1, null, N'crew', 'project_attachment'),
            (@maxfunction_id+3, N'F808DA39-BA82-482B-90D8-912ECB41BC04', N'project', N'dry_dock', N'Dry Dock', 1, getdate(), NULL, NULL, 1, N'project', N'crew', 'dry_dock_attachment'),
            (@maxfunction_id+4, N'9C79EF57-A1C6-40B4-A343-968976325150', N'project', N'standard_job', N'Standard Job', 1, getdate(), NULL, NULL, 1, N'project', N'crew', 'standard_job_attachment')                
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

            await queryRunner.query(`
            MERGE INTO INF_LIB_Right AS TARGET
            USING (VALUES 
            ('218da033-cff4-4600-92e6-4e7e958d7004', 'projects_view_list', 'View project records in main page', 'o', 'project',
            'project_index', 'view_projects_list', 1, getdate(), 1, NULL, 1, 'View Project Records Main', NULL),

            ('ba88a0df-854b-4f07-b879-c2577e3777bd', 'projects_view_list_onboard', 'View project records in main page', 'v', 'project',
            'project_index', 'view_projects_list_onboard', 1, getdate(), 1, NULL, 1, 'View Project Records Main', NULL),

            ('6648945d-5b7c-4557-aa32-af85ccbfb14a', 'dry_dock_project_create', 'Create dry dock project', 'o', 'project',
            'project_index', 'create_dry_dock_project', 1, getdate(), 1, NULL, 1, 'Create Dry Dock Project', NULL),
            
            ('cbd1b4ec-5dee-4437-ae86-f367ed576ea0', 'dry_dock_project_delete', 'Delete dry dock project', 'o', 'project',
            'project_index', 'delete_dry_dock_project', 1, getdate(), 1, NULL, 1, 'Delete Dry Dock Project', NULL),

            ('BA21E7BB-F456-4419-AF36-6977F3CC694F', 'standard_job_view_grid', 'View standard job in main grid', 'o', 'project',
            'standard_job', 'view_standard_job_grid', 1, getdate(), 1, NULL, 1, 'View Standard Job Main Grid', NULL),

            ('B3A74BE1-B679-42D9-9409-ACF9834F714D', 'standard_job_view_details', 'View standard job detail', 'o', 'project',
            'standard_job', 'view_standard_job_detail', 1, getdate(), 1, NULL, 1, 'View Standard Job Detail', NULL),
            
            ('1670FB06-ED7A-4167-8E54-BF0E839849B0', 'standard_job_create', 'Create access rights for standard job detail', 'o', 'project',
            'standard_job', 'create_standard_job', 1, getdate(), 1, NULL, 1, 'Create Standard Job', NULL),
            
            ('B5BE23E3-F844-4C48-8950-68D5A8E71896', 'standard_job_edit', '	Edit access rights for standard job detail', 'o', 'project',
            'standard_job', 'edit_standard_job', 1, getdate(), 1, NULL, 1, 'Edit Standard Job', NULL),
            
            ('50E06555-62E3-4445-A2F5-1A9E67DE3207', 'standard_job_delete', 'Delete access rights for standard job', 'o', 'project',
            'standard_job', 'delete_standard_job', 1, getdate(), 1, NULL, 1, 'Delete Standard Job', NULL)
            )

            AS SOURCE ([Right_UID], [Right_Code], [Right_Description], [Valid_On], [Module_Code],
            [Function_Code], [Action], [Created_By], [Date_Of_Creation], [Modified_By], [Date_Of_Modification],
            [Active_Status], [right_name], [api_url])

            ON TARGET.[Right_Code] = SOURCE.[Right_Code]

            WHEN MATCHED THEN
            UPDATE SET TARGET.[Right_Code]=SOURCE.[Right_Code], TARGET.[Right_Description]=SOURCE.[Right_Description], 
            TARGET.[Valid_On]=SOURCE.[Valid_On], TARGET.[Module_Code]=SOURCE.[Module_Code],
			TARGET.[Function_Code]=SOURCE.[Function_Code], TARGET.[Action]=SOURCE.[Action],
            TARGET.[Modified_By]=1, TARGET.[Date_Of_Modification]=getdate(), TARGET.[Active_Status]=1,
            TARGET.[right_name]=SOURCE.[right_name], TARGET.[api_url] = SOURCE.[api_url]

            WHEN NOT MATCHED BY TARGET THEN
            INSERT ([Right_UID], [Right_Code], [Right_Description], [Valid_On], [Module_Code],
                    [Function_Code], [Action], [Created_By], [Date_Of_Creation], [Modified_By],
                    [Date_Of_Modification], [Active_Status], [right_name], [api_url])
            VALUES (SOURCE.[Right_UID], SOURCE.[Right_Code], SOURCE.[Right_Description],
                    SOURCE.[Valid_On], SOURCE.[Module_Code], SOURCE.[Function_Code],
                    SOURCE.[Action], SOURCE.[Created_By], SOURCE.[Date_Of_Creation], SOURCE.[Modified_By],
                    SOURCE.[Date_Of_Modification], SOURCE.[Active_Status], SOURCE.[right_name], SOURCE.[api_url]);
            `);

            await MigrationUtilsService.migrationLog(
                this.className,
                '',
                'S',
                'dry_dock',
                'dry dock and standard job access rights',
            );

        } catch (error) {
            await MigrationUtilsService.migrationLog(
                this.className,
                JSON.stringify(error),
                'E',
                'dry_dock',
                'dry dock and standard job access rights',
                true,
            );
        }
    }

    public async down(): Promise<void> {}
}
