import { eApplicationLocation, MigrationUtilsService } from 'j2utils';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { errorLikeToString } from '../../common/drydock/ts-helpers/error-like-to-string';

// eslint-disable-next-line @typescript-eslint/naming-convention
export class createStandardJobsAccessRights1698829536837 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const className = this.constructor.name;
        try {
            const application = await MigrationUtilsService.getApplicationLocation();
            if (application === eApplicationLocation.Office) {
                await queryRunner.query(`
            MERGE INTO INF_Lib_Module AS TARGET
USING (VALUES (196, '677D0F79-281F-4A23-A226-C61D84222A26', 'project', 'Project', 1, getdate(), NULL, NULL, 1,
               'accounting'))
    AS SOURCE ([ModuleId], [Module_UID], [Module_Code], [Module_Name], [Created_By], [Date_Of_Creation], [Modified_By],
               [Date_Of_Modification], [Active_Status], [parent_module_code])
ON TARGET.[Module_Code] = SOURCE.[Module_Code]
WHEN MATCHED THEN
    UPDATE
    SET TARGET.ModuleId             = SOURCE.ModuleId,
        TARGET.Module_UID           = SOURCE.Module_UID,
        TARGET.Module_Name          = SOURCE.Module_Name,
        TARGET.Created_By           = SOURCE.Created_By,
        TARGET.Date_Of_Creation     = SOURCE.Date_Of_Creation,
        TARGET.Modified_By          = 1,
        TARGET.Date_Of_Modification = getdate(),
        TARGET.Active_Status        = SOURCE.Active_Status,
        TARGET.parent_module_code   = SOURCE.parent_module_code
WHEN NOT MATCHED BY TARGET THEN
    INSERT ([ModuleId], [Module_UID], [Module_Code], [Module_Name], [Created_By], [Date_Of_Creation], [Modified_By],
            [Date_Of_Modification], [Active_Status], [parent_module_code])
    VALUES (SOURCE.[ModuleId], SOURCE.[Module_UID], SOURCE.[Module_Code],
            SOURCE.[Module_Name], SOURCE.[Created_By], SOURCE.[Date_Of_Creation],
            SOURCE.[Modified_By], SOURCE.[Date_Of_Modification], SOURCE.[Active_Status], SOURCE.[parent_module_code]);
			`);

                await queryRunner.query(`
                MERGE INTO inf_lib_function AS TARGET
USING (VALUES (3160, '9C79EF57-A1C6-40B4-A343-968976325150', 'project', 'standard_job', 'Standard Job', 1, getdate(), 1,
               NULL, 1, NULL, 'crew', 'standard_job_attachment'))
    AS SOURCE ([FunctionId], [Function_UID], [Module_Code], [Function_Code], [Function_Name], [Created_By],
               [Date_Of_Creation], [Modified_By], [Date_Of_Modification], [Active_Status], [parent_function_code],
               [parent_module_code], [attach_prefix])
ON TARGET.[Function_Code] = SOURCE.[Function_Code]
WHEN MATCHED THEN
    UPDATE
    SET TARGET.[FunctionId]           = SOURCE.[FunctionId],
        TARGET.[Function_UID]         = SOURCE.[Function_UID],
        TARGET.[Module_Code]          = SOURCE.[Module_Code],
        TARGET.[Function_Name]        = SOURCE.[Function_Name],
        [Modified_By]                 = 1,
        [Date_Of_Modification]        = getdate(),
        TARGET.[Active_Status]        = SOURCE.[Active_Status],
        TARGET.[parent_function_code] = SOURCE.[parent_function_code],
        TARGET.[parent_module_code]   = SOURCE.[parent_module_code],
        TARGET.[attach_prefix]        = SOURCE.[attach_prefix]
WHEN NOT MATCHED BY TARGET THEN
    INSERT ([FunctionId], [Function_UID], [Module_Code], [Function_Code], [Function_Name],
            [Created_By], [Date_Of_Creation], [Modified_By], [Date_Of_Modification], [Active_Status],
            [parent_function_code], [parent_module_code], [attach_prefix])
    VALUES (SOURCE.[FunctionId], SOURCE.[Function_UID], SOURCE.[Module_Code],
            SOURCE.[Function_Code], SOURCE.[Function_Name], SOURCE.[Created_By], SOURCE.[Date_Of_Creation],
            SOURCE.[Modified_By], SOURCE.[Date_Of_Modification], SOURCE.[Active_Status],
            SOURCE.[parent_function_code], SOURCE.[parent_module_code], SOURCE.[attach_prefix]);
			`);

                await queryRunner.query(`
            MERGE INTO INF_LIB_Right AS TARGET
USING (VALUES ('BA21E7BB-F456-4419-AF36-6977F3CC694F', 'standard_job_view_grid',
               'View data on the standard job main grid', 'o', 'project',
               'standard_job', 'view_standard_job_grid', 1, getdate(), 1, NULL, 1,
               'View Standard Job Grid', NULL),
              ('B3A74BE1-B679-42D9-9409-ACF9834F714D', 'standard_job_view_details',
               'View data on the standard job details page', 'o', 'project',
               'standard_job', 'view_standard_job_detail', 1, getdate(), 1, NULL, 1,
               'View Standard Job Details', NULL),
              ('1670FB06-ED7A-4167-8E54-BF0E839849B0', 'standard_job_create',
               'Create standard job', 'o', 'project',
               'standard_job', 'create_standard_job', 1, getdate(), 1, NULL, 1,
               'Create Standard Job', NULL),
              ('B5BE23E3-F844-4C48-8950-68D5A8E71896', 'standard_job_edit',
               'Edit standard job', 'o', 'project',
               'standard_job', 'edit_standard_job', 1, getdate(), 1, NULL, 1,
               'Edit Standard Job', NULL),
              ('50E06555-62E3-4445-A2F5-1A9E67DE3207', 'standard_job_delete',
               'Delete standard job', 'o', 'project',
               'standard_job', 'delete_standard_job', 1, getdate(), 1, NULL, 1,
               'Delete Standard Job', NULL))
    AS SOURCE ([Right_UID], [Right_Code], [Right_Description], [Valid_On], [Module_Code],
               [Function_Code], [Action], [Created_By], [Date_Of_Creation], [Modified_By], [Date_Of_Modification],
               [Active_Status], [right_name], [api_url])
ON TARGET.[Right_Code] = SOURCE.[Right_Code]
WHEN MATCHED THEN
    UPDATE
    SET TARGET.[Right_UID]=SOURCE.[Right_UID],
        TARGET.[Right_Code]=SOURCE.[Right_Code],
        TARGET.[Right_Description]=SOURCE.[Right_Description],
        TARGET.[Valid_On]=SOURCE.[Valid_On],
        TARGET.[Module_Code]=SOURCE.[Module_Code],
        TARGET.[Function_Code]=SOURCE.[Function_Code],
        TARGET.[Action]=SOURCE.[Action],
        TARGET.[Modified_By]=1,
        TARGET.[Date_Of_Modification]=getdate(),
        TARGET.[Active_Status]=1,
        TARGET.[right_name]=SOURCE.[right_name],
        TARGET.[api_url] = SOURCE.[api_url]
WHEN NOT MATCHED BY TARGET THEN
    INSERT ([Right_UID], [Right_Code], [Right_Description], [Valid_On], [Module_Code],
            [Function_Code], [Action], [Created_By], [Date_Of_Creation], [Modified_By],
            [Date_Of_Modification], [Active_Status], [right_name], [api_url])
    VALUES (SOURCE.[Right_UID], SOURCE.[Right_Code], SOURCE.[Right_Description],
            SOURCE.[Valid_On], SOURCE.[Module_Code], SOURCE.[Function_Code],
            SOURCE.[Action], SOURCE.[Created_By], SOURCE.[Date_Of_Creation], SOURCE.[Modified_By],
            SOURCE.[Date_Of_Modification], SOURCE.[Active_Status], SOURCE.[right_name], SOURCE.[api_url]);
			`);

                await queryRunner.query(`
            MERGE INTO inf_lnk_right_user_type AS TARGET
USING (VALUES ('2FC2D1C1-4754-4032-A06D-1856F4878282', 'standard_job_view_grid',
               '3C084885-783B-46B8-9635-B2F70CC49218', 1, 1, getdate(), 1, NULL),
              ('18ACFDF9-633A-44DF-9292-ADD734473A70', 'standard_job_view_details',
               '3C084885-783B-46B8-9635-B2F70CC49218', 1, 1, getdate(), 1, NULL),
              ('81A75BB5-3D99-4DC1-A663-3F9990E27F18', 'standard_job_create',
               '3C084885-783B-46B8-9635-B2F70CC49218', 1, 1, getdate(), 1, NULL),
              ('0C27413F-3001-4DDD-A0BF-9F2095160E08', 'standard_job_edit',
               '3C084885-783B-46B8-9635-B2F70CC49218', 1, 1, getdate(), 1, NULL),
              ('E3811285-B0B9-4075-B607-8238CD1D3310', 'standard_job_delete',
               '3C084885-783B-46B8-9635-B2F70CC49218', 1, 1, getdate(), 1, NULL))
    AS SOURCE ([uid], [right_code], [user_type_uid], [active_status], [created_by],
               [date_of_creation], [modified_by], [date_of_modification])
ON TARGET.uid = SOURCE.uid
WHEN MATCHED THEN
    UPDATE
    SET TARGET.[right_code]          = SOURCE.[right_code],
        TARGET.[user_type_uid]       = SOURCE.[user_type_uid],
        TARGET.[active_status]       = SOURCE.[active_status],
        TARGET.[modified_by]         = 1,
        TARGET.[date_of_modification]= getdate()
WHEN NOT MATCHED BY TARGET THEN
    INSERT ([uid], [right_code], [user_type_uid], [active_status], [created_by], [date_of_creation], [modified_by],
            [date_of_modification])
    VALUES (SOURCE.[uid], SOURCE.[right_code], SOURCE.[user_type_uid], SOURCE.[active_status],
            SOURCE.[created_by], SOURCE.[date_of_creation], SOURCE.[modified_by], SOURCE.[date_of_modification]);
            `);

                await queryRunner.query(`
            MERGE INTO INF_Lib_Group AS TARGET
USING (VALUES ('1E637A5F-2805-4933-ADAF-51B118381995', 'view_standard_job',
               'View access for standard job', '1',
               getdate(), null, null, 1, 'View Standard Job',
               '3C084885-783B-46B8-9635-B2F70CC49218'),
              ('86D6CCBA-D9E7-4549-BC13-52E584DA327B', 'create_or_edit_standard_job',
               'Create or edit access for standard job', '1',
               getdate(), null, null, 1, 'Create or Edit Standard Job',
               '3C084885-783B-46B8-9635-B2F70CC49218'),
              ('EE9CEEDF-9F5E-41D4-98CA-993346082024', 'delete_standard_job',
               'Delete access for standard job', '1',
               getdate(), null, null, 1, 'Delete Standard Job',
               '3C084885-783B-46B8-9635-B2F70CC49218'))
    AS SOURCE ([Group_UID], [Group_Code], [Group_Description], [Created_By], [Date_Of_Creation],
               [Modified_By], [Date_Of_Modification], [Active_Status], [group_name], [user_type_uid])
ON TARGET.[Group_UID] = SOURCE.[Group_UID]
WHEN MATCHED THEN
    UPDATE
    SET TARGET.[Group_Code]           = SOURCE.[Group_Code],
        TARGET.[Group_Description]    = SOURCE.[Group_Description],
        TARGET.[Created_By]           = SOURCE.[Created_By],
        TARGET.[Date_Of_Creation]     = SOURCE.[Date_Of_Creation],
        TARGET.[Modified_By]          = 1,
        TARGET.[Date_Of_Modification] = getdate(),
        TARGET.[Active_Status]        = SOURCE.[Active_Status],
        TARGET.[group_name]           = SOURCE.[group_name],
        TARGET.[user_type_uid]        = SOURCE.[user_type_uid]
WHEN NOT MATCHED BY TARGET THEN
    INSERT ([Group_UID], [Group_Code], [Group_Description], [Created_By], [Date_Of_Creation],
            [Modified_By], [Date_Of_Modification], [Active_Status], [group_name], [user_type_uid])
    VALUES (SOURCE.[Group_UID], SOURCE.[Group_Code], SOURCE.[Group_Description],
            SOURCE.[Created_By], SOURCE.[Date_Of_Creation], SOURCE.[Modified_By],
            SOURCE.[Date_Of_Modification], SOURCE.[Active_Status], SOURCE.[group_name], SOURCE.[user_type_uid]);
            `);

                await queryRunner.query(`
MERGE INTO INF_Lib_GroupRights AS TARGET
USING (VALUES (N'93F77FB3-1D81-4346-933D-FB883DEF28F5', N'view_standard_job',
               N'standard_job_view_grid', 1, N'1', getdate(), NULL, NULL),
              (N'DEF7A118-091B-4F71-980E-F96F1C0DC0E6', N'view_standard_job',
               N'standard_job_view_details', 1, N'1', getdate(), NULL, NULL),
              (N'E4EBA0ED-BC0A-401E-A898-0FFCE47F8F1C', N'create_or_edit_standard_job',
               N'standard_job_create', 1, N'1', getdate(), NULL, NULL),
              (N'1C9E7B7A-E35A-4A3A-96EE-6F0BBCE60600', N'create_or_edit_standard_job',
               N'standard_job_edit', 1, N'1', getdate(), NULL, NULL),
              (N'58A25A77-1D1C-4D86-988B-ACC85233AF4A', N'delete_standard_job',
               N'standard_job_delete', 1, N'1', getdate(), NULL, NULL))
    AS SOURCE ([GR_UID], [GR_Group_Code], [GR_Right_Code], [Active_Status], [created_by],
               [date_of_creation], [modified_by], [date_of_modification])
ON TARGET.GR_UID = SOURCE.GR_UID
WHEN MATCHED THEN
    UPDATE
    SET TARGET.[GR_UID]              = SOURCE.[GR_UID],
        TARGET.[GR_Group_Code]= SOURCE.[GR_Group_Code],
        TARGET.[Active_Status]       = SOURCE.[Active_Status],
        TARGET.[modified_by]         = 1,
        TARGET.[date_of_modification]= getdate()
WHEN NOT MATCHED BY TARGET THEN
    INSERT ([GR_UID], [GR_Group_Code], [GR_Right_Code], [Active_Status], [created_by],
            [date_of_creation], [modified_by], [date_of_modification])
    VALUES (SOURCE.[GR_UID], SOURCE.[GR_Group_Code], SOURCE.[GR_Right_Code],
            SOURCE.[active_status], SOURCE.[created_by], SOURCE.[date_of_creation],
            SOURCE.[modified_by], SOURCE.[date_of_modification]);
            `);

                await queryRunner.query(`
                if exists(select *
          from INF_Lib_Roles
          where Role = 'Client Admin'
            and Active_Status = 1)
    Begin
        Declare @AdminRoleId int
        select @AdminRoleId = Role_ID from INF_Lib_Roles where Role = 'Client Admin' and Active_Status = 1
        MERGE INTO INF_Lib_RoleGroupsRights AS TARGET
        USING (VALUES (N'F3BF157C-313E-4C94-B430-E75639FD23F5', @AdminRoleId, NULL,
                       N'view_standard_job', 1, getdate(), NULL, NULL, 1),
                      (N'0D863238-5948-4338-BD1D-566AC06F3769', @AdminRoleId, NULL,
                       N'create_or_edit_standard_job', 1, getdate(), NULL, NULL, 1),
                      (N'3018773E-61EF-4D9B-BA46-7DA2DF7F0B09', @AdminRoleId, NULL,
                       N'delete_standard_job', 1, getdate(), NULL, NULL, 1))
            AS SOURCE ([RGR_UID], [RGR_Role_ID], [RGR_Right_Code], [RGR_Group_Code], [Created_By], [Date_Of_Creation],
                       [Modified_By],
                       [Date_Of_Modification], [Active_Status])
        ON TARGET.RGR_UID = SOURCE.RGR_UID
        WHEN MATCHED THEN
            UPDATE
            SET TARGET.[RGR_UID]             = SOURCE.[RGR_UID],
                TARGET.[RGR_Role_ID]= SOURCE.[RGR_Role_ID],
                TARGET.[RGR_Right_Code]      = SOURCE.[RGR_Right_Code],
                TARGET.[RGR_Group_Code]= SOURCE.[RGR_Group_Code],
                TARGET.[Created_By]          = SOURCE.[Created_By],
                TARGET.[Date_Of_Creation]    = SOURCE.[Date_Of_Creation],
                TARGET.[Modified_By]         = 1,
                TARGET.[Date_Of_Modification]= getdate(),
                TARGET.[Active_Status]       = SOURCE.[Active_Status]
        WHEN NOT MATCHED BY TARGET THEN
            INSERT ([RGR_UID], [RGR_Role_ID], [RGR_Right_Code], [RGR_Group_Code], [Created_By],
                    [Date_Of_Creation], [Modified_By], [Date_Of_Modification], [Active_Status])
            VALUES (SOURCE.[RGR_UID], SOURCE.[RGR_Role_ID], SOURCE.[RGR_Right_Code],
                    SOURCE.[RGR_Group_Code], SOURCE.[Created_By], SOURCE.[Date_Of_Creation],
                    SOURCE.[Modified_By], SOURCE.[Date_Of_Modification], SOURCE.[Active_Status]);
    End
            `);

                await queryRunner.query(`
             if exists(select *
          from INF_Lib_Roles
          where Role = 'JiBe Crew Implementation'
            and Active_Status = 1)
    Begin
        Declare @JibeImplementationRoleId int
        select @JibeImplementationRoleId = Role_ID
        from INF_Lib_Roles
        where Role = 'JiBe Crew Implementation'
          and Active_Status = 1
        MERGE INTO INF_Lib_RoleGroupsRights AS TARGET
        USING (VALUES (N'9C70C210-9537-4A4D-98D0-BAD38907D0A3', @JibeImplementationRoleId, NULL,
                       N'view_standard_job', 1, getdate(), NULL, NULL, 1),
                      (N'65F2970C-84DC-42A3-A8CA-5D035E6A789A', @JibeImplementationRoleId, NULL,
                       N'create_or_edit_standard_job', 1, getdate(), NULL, NULL, 1),
                      (N'F3F0C908-DDC9-434E-B1BE-679934E18B77', @JibeImplementationRoleId, NULL,
                       N'delete_standard_job', 1, getdate(), NULL, NULL, 1))
            AS SOURCE ([RGR_UID], [RGR_Role_ID], [RGR_Right_Code], [RGR_Group_Code], [Created_By], [Date_Of_Creation],
                       [Modified_By], [Date_Of_Modification], [Active_Status])
        ON TARGET.RGR_UID = SOURCE.RGR_UID
        WHEN MATCHED THEN
            UPDATE
            SET TARGET.[RGR_UID]             = SOURCE.[RGR_UID],
                TARGET.[RGR_Role_ID]= SOURCE.[RGR_Role_ID],
                TARGET.[RGR_Right_Code]      = SOURCE.[RGR_Right_Code],
                TARGET.[RGR_Group_Code]= SOURCE.[RGR_Group_Code],
                TARGET.[Created_By]          = SOURCE.[Created_By],
                TARGET.[Date_Of_Creation]    = SOURCE.[Date_Of_Creation],
                TARGET.[Modified_By]         = 1,
                TARGET.[Date_Of_Modification]= getdate(),
                TARGET.[Active_Status]       = SOURCE.[Active_Status]
        WHEN NOT MATCHED BY TARGET THEN
            INSERT ([RGR_UID], [RGR_Role_ID], [RGR_Right_Code], [RGR_Group_Code], [Created_By],
                    [Date_Of_Creation], [Modified_By], [Date_Of_Modification], [Active_Status])
            VALUES (SOURCE.[RGR_UID], SOURCE.[RGR_Role_ID], SOURCE.[RGR_Right_Code],
                    SOURCE.[RGR_Group_Code], SOURCE.[Created_By], SOURCE.[Date_Of_Creation],
                    SOURCE.[Modified_By], SOURCE.[Date_Of_Modification], SOURCE.[Active_Status]);
    END
             `);
            }
            await MigrationUtilsService.migrationLog(
                className,
                '',
                'S',
                'crew_accounts',
                'create access rights for j3 standard jobs',
            );
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                className,
                errorLikeToString(error),
                'E',
                'crew_accounts',
                'create access rights for j3 standard jobs',
                true,
            );
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public async down(): Promise<void> {}
}
