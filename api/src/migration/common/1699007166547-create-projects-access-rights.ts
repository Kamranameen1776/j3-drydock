import { eApplicationLocation, MigrationUtilsService } from 'j2utils';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class createProjectsAccessRights1699007166547 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const className = this.constructor.name;
        try {
            const applocation = await MigrationUtilsService.getApplicationLocation();
            if (applocation === eApplicationLocation.Office) {
                await queryRunner.query(`
                MERGE INTO INF_Lib_Module AS TARGET
                USING (VALUES (196, '93a7855b-0445-4f29-978e-53d11dafa767', 'project', 'Project', 1, getdate(), NULL, NULL, 1,
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
USING (VALUES (3160, 'af1c36a1-9cd0-43c4-b4e2-62f500729fd4', 'project', 'project', 'Project', 1, getdate(), 1, NULL, 1, NULL, 'crew', NULL),
				(3160, 'f808da39-ba82-482b-90d8-912ecb41bc04', 'project', 'dry_dock', 'Dry Dock', 1, getdate(), 1, NULL, 1, NULL, 'crew', NULL))
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
 USING (VALUES ('218da033-cff4-4600-92e6-4e7e958d7004', 'projects_view_list', 'View project records in main page', 'o', 'project',
                'project', 'view_projects_list', 1, getdate(), 1, NULL, 1, 'View Project Records Main', NULL),
 
                ('ba88a0df-854b-4f07-b879-c2577e3777bd', 'projects_view_list_onboard', 'View project records in main page', 'v', 'project',
                'project', 'view_projects_list_onboard', 1, getdate(), 1, NULL, 1, 'View Project Records Main', NULL),
 
                ('6648945d-5b7c-4557-aa32-af85ccbfb14a', 'dry_dock_project_create', 'Create dry dock project', 'o', 'project',
                'project', 'create_dry_dock_project', 1, getdate(), 1, NULL, 1, 'Create Dry Dock Project', NULL),
                 
                 ('cbd1b4ec-5dee-4437-ae86-f367ed576ea0', 'dry_dock_project_delete', 'Delete dry dock project', 'o', 'project',
                'project', 'delete_dry_dock_project', 1, getdate(), 1, NULL, 1, 'Delete Dry Dock Project', NULL),
 
                ('d39cf0f9-5386-4506-a130-2b621707e757', 'dry_dock_project_view_details', 'View dry dock project detail page', 'o', 'project',
                'dry_dock', 'view_details_dry_dock_project', 1, getdate(), 1, NULL, 1, 'View Dry Dock Project Detail', NULL),
                
                 ('70b68d32-63b8-4ff7-8695-aec5a9e899f1', 'dry_dock_project_attachment_view', 'View attachment rights for project dry dock', 'o', 'project',
                'dry_dock', 'view_dry_dock_project_att', 1, getdate(), 1, NULL, 1, 'View Attachment in Project Dry Dock', NULL),
 
 
                ('78ca7a6d-2b5d-4389-bd3f-1aa5e06f3545', 'dry_dock_project_view_details_onboard', 'View dry dock project detail page', 'v', 'project',
                'dry_dock', 'view_dd_project_details_onb', 1, getdate(), 1, NULL, 1, 'View Dry Dock Project Detail', NULL),
 
                ('dd7a5ea8-1ee5-4c52-aa3b-3b27288d1926', 'dry_dock_project_attachment_view_onboard', 'View attachment rights for project dry dock', 'v', 'project',
                'dry_dock', 'view_dd_project_att_onb', 1, getdate(), 1, NULL, 1, 'View Attachment in Project Dry Dock', NULL),
 
                ('8d0cbdfb-0f49-4b6f-85e3-040fd392813a', 'dry_dock_project_edit_header', 'Edit header section in project dry dock', 'o', 'project',
                'dry_dock', 'edit_dd_project_header', 1, getdate(), 1, NULL, 1, 'Edit Header Section of Project Dry Dock', NULL),
 
                ('98d8cf6b-72bf-43f4-ba4c-8792adfe1f3e', 'dry_dock_project_edit_flow', 'Add or Edit Workflow and Follow up in project Dry Dock', 'o', 'project',
                'dry_dock', 'edit_dd_project_flow', 1, getdate(), 1, NULL, 1, 'Add or Edit Workflow and Follow up in Project Dry Dock', NULL),
 
                ('e871b32a-8b37-4e81-95a0-227037d2e512', 'dry_dock_project_attachment_add', 'Add attachment rights for project dry dock', 'o', 'project',
                'dry_dock', 'add_dd_project_att', 1, getdate(), 1, NULL, 1, 'Add Attachment in Project Dry Dock', NULL),
 
                ('d1aa0d3d-bb13-48d7-9d17-4e3b3901b51c', 'dry_dock_project_attachment_edit', 'Edit attachment rights for project dry dock', 'o', 'project',
                'dry_dock', 'edit_dd_project_att', 1, getdate(), 1, NULL, 1, 'Edit Attachment in Project Dry Dock', NULL),
 
                ('ce04db58-161a-4a1e-b89b-7d3acdd4aea5', 'dry_dock_project_attachment_delete', 'Delete attachment rights for project dry dock', 'o', 'project',
                'dry_dock', 'delete_dd_project_att', 1, getdate(), 1, NULL, 1, 'Delete Attachment in Project Dry Dock', NULL),
 
                ('860c2446-c5d0-4880-84f4-268dfc8ae4d1', 'dry_dock_project_edit_header_onboard', 'Edit header section in project dry dock', 'v', 'project',
                'dry_dock', 'edit_dd_project_header_onb', 1, getdate(), 1, NULL, 1, 'Edit Header Section in Project Dry Dock', NULL),
 
                ('403a0b02-6a4c-43dc-9791-dccb89b938f1', 'dry_dock_project_edit_flow_onboard', 'Add or Edit Workflow and Follow up in project Dry Dock', 'v', 'project',
                'dry_dock', 'edit_dd_project_flow_onb', 1, getdate(), 1, NULL, 1, 'Add or Edit Workflow and Follow up in Project Dry Dock', NULL),
 
               ('56c0d41f-c230-4132-a300-0c2566e2ecce', 'dry_dock_project_attachment_add_onboard', 'Add attachment rights for project dry dock', 'v', 'project',
                'dry_dock', 'add_dd_project_att_onb', 1, getdate(), 1, NULL, 1, 'Add Attachment in Project Dry Dock', NULL),
 
               ('3fa3988a-e6d5-4944-b4aa-f3932e986006', 'dry_dock_project_attachment_edit_onboard', 'Edit attachment rights for project dry dock', 'v', 'project',
                'dry_dock', 'edit_dd_project_att_onb', 1, getdate(), 1, NULL, 1, 'Edit Attachment in Project Dry Dock', NULL),
 
               ('a8318817-4c33-49c8-b516-a796ea305c95', 'dry_dock_project_attachment_delete_onboard', 'Delete attachment rights for project dry dock', 'v', 'project',
                'dry_dock', 'delete_dd_project_att_onb', 1, getdate(), 1, NULL, 1, 'Delete Attachment in Project Dry Dock', NULL)   
                )
 
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
                USING (VALUES ('82b76534-26fb-4e52-a492-bec49633eb96', 'projects_view_list','3C084885-783B-46B8-9635-B2F70CC49218', 1, 1, getdate(), 1, NULL),
                                ('9fdadd3c-28e7-4bad-bb44-e16fb11e5898', 'projects_view_list_onboard','0F3613B9-9FB5-40E6-8763-FC4941136598', 1, 1, getdate(), 1, NULL),
                                ('edfa8320-9f63-4675-8569-2390270a1c40', 'dry_dock_project_create','3C084885-783B-46B8-9635-B2F70CC49218', 1, 1, getdate(), 1, NULL),
                                ('2a50bedf-5828-4ed1-b8e1-604763afac41', 'dry_dock_project_delete','3C084885-783B-46B8-9635-B2F70CC49218', 1, 1, getdate(), 1, NULL),
                                ('31fbd9fa-68c2-4529-8d36-b2404090590b', 'dry_dock_project_view_details','3C084885-783B-46B8-9635-B2F70CC49218', 1, 1, getdate(), 1, NULL),
                                ('cf5152f5-1d89-4f05-854b-359cc7a0a761', 'dry_dock_project_attachment_view','3C084885-783B-46B8-9635-B2F70CC49218', 1, 1, getdate(), 1, NULL),
                                ('5da29cac-f11c-477d-91d8-f46d5f391414', 'dry_dock_project_view_details_onboard','0F3613B9-9FB5-40E6-8763-FC4941136598', 1, 1, getdate(), 1, NULL),
                                ('e92b8227-ed50-474b-a310-e3f0f6bdb7be', 'dry_dock_project_attachment_view_onboard','0F3613B9-9FB5-40E6-8763-FC4941136598', 1, 1, getdate(), 1, NULL),
                                ('bad5e34d-40ca-4277-a826-07c179926d88', 'dry_dock_project_edit_header','3C084885-783B-46B8-9635-B2F70CC49218', 1, 1, getdate(), 1, NULL),
                                ('a33f4679-786b-472c-9605-4ea64e01393d', 'dry_dock_project_edit_flow','3C084885-783B-46B8-9635-B2F70CC49218', 1, 1, getdate(), 1, NULL),
                                ('efefcccd-d9c6-4636-8329-c5e2d1f07d1d', 'dry_dock_project_attachment_add','3C084885-783B-46B8-9635-B2F70CC49218', 1, 1, getdate(), 1, NULL),
                                ('b0a37880-6374-48f1-889a-2943033f5d67', 'dry_dock_project_attachment_edit','3C084885-783B-46B8-9635-B2F70CC49218', 1, 1, getdate(), 1, NULL),
                                ('5479d97b-25e6-409d-8e71-bcf2bf6cd275', 'dry_dock_project_attachment_delete','3C084885-783B-46B8-9635-B2F70CC49218', 1, 1, getdate(), 1, NULL),
                                ('7e4c16e4-4c30-43b6-915a-99ee5fc84034', 'dry_dock_project_edit_header_onboard','0F3613B9-9FB5-40E6-8763-FC4941136598', 1, 1, getdate(), 1, NULL),
                                ('eeafb013-23d5-4508-afb7-47600a98f5d7', 'dry_dock_project_edit_flow_onboard','0F3613B9-9FB5-40E6-8763-FC4941136598', 1, 1, getdate(), 1, NULL),
                                ('3348054e-2d01-4a37-b2c1-4aa464299664', 'dry_dock_project_attachment_add_onboard','0F3613B9-9FB5-40E6-8763-FC4941136598', 1, 1, getdate(), 1, NULL),
                                ('2c829037-f275-401f-aaa8-2b60e961f64d', 'dry_dock_project_attachment_edit_onboard','0F3613B9-9FB5-40E6-8763-FC4941136598', 1, 1, getdate(), 1, NULL),
                                ('55dac786-e4ed-4a89-89aa-1ef0d6642404', 'dry_dock_project_attachment_delete_onboard','0F3613B9-9FB5-40E6-8763-FC4941136598', 1, 1, getdate(), 1, NULL))
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
                USING (VALUES ('28ee5f8b-d5d3-40c9-b5fb-f8f782b16046', 'view_project_main', 
                                'View access rights for project main page', '1', getdate(), null, null, 1, 'View Project Main', '3C084885-783B-46B8-9635-B2F70CC49218'),
                
                              ('59fba6b5-0138-457c-ab59-8648b84b82cd', 'view_project_main_onboard',
                                'View access rights for project main page onboard', '1', getdate(), null, null, 1, 'View Project Main Onboard', '0F3613B9-9FB5-40E6-8763-FC4941136598'),
                
                              ('c94398b5-7721-4165-baaf-e8dde3d2e38f', 'create_projects', 
                              'Create  access rights for projects', '1', getdate(), null, null, 1, 'Create Projects', '3C084885-783B-46B8-9635-B2F70CC49218'),
                
                              ('5ef60255-a160-4377-954d-38a71049f1bf', 'delete_projects', 
                              'Delete access rights for projects', '1', getdate(), null, null, 1, 'Delete Projects', '3C084885-783B-46B8-9635-B2F70CC49218'),
                
                              ('f5b71754-7e12-4061-a283-8c852874b1f6', 'view_dry_dock_project_detail', 
                              'View access rights for project detail', '1', getdate(), null, null, 1, 'View Dry Dock Project Detail', '3C084885-783B-46B8-9635-B2F70CC49218'),
                
                              ('e19bf723-43d4-4b6f-a638-8f960009a5c6', 'view_dry_dock_project_detail_onboard', 
                              'View access rights for project detail  Onboard', '1', getdate(), null, null, 1, 'View Dry Dock Project Detail Onboard', '0F3613B9-9FB5-40E6-8763-FC4941136598'),
                
                              ('f0709c15-1086-49c6-95fa-504c10f87f9e', 'edit_dry_dock_porject_detail', 
                              'Edit access right for dry dock project detail page', '1', getdate(), null, null, 1, 'Edit Dry Dock Project Detail', '3C084885-783B-46B8-9635-B2F70CC49218'),
                
                              ('ef3cefd6-6827-40f4-b579-e492fdd6b7e9', 'edit_dry_dock_porject_detail_onboard', 
                              'Edit access right for dry dock project detail page onboard', '1', getdate(), null, null, 1, 'Edit Dry Dock Project Detail onboard', '0F3613B9-9FB5-40E6-8763-FC4941136598'))
                
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
                USING (VALUES (N'4cd31095-25c0-428c-9658-ca7c887016c2', N'view_project_main', N'projects_view_list', 1, N'1', getdate(), NULL, NULL),
                                (N'0c98027a-25f8-4f81-9e9c-d99f7a98de99', N'view_project_main_onboard', N'projects_view_list_onboard', 1, N'1', getdate(), NULL, NULL),
                                (N'508e5de0-0f23-4b67-9f43-85cc1b1616e2', N'create_projects', N'dry_dock_project_create', 1, N'1', getdate(), NULL, NULL),
                                (N'3df12c01-368d-4669-8eeb-2c220b084af0', N'delete_projects', N'dry_dock_project_delete', 1, N'1', getdate(), NULL, NULL),
                                (N'8ea2b381-195d-4611-8030-2d064fdbf16a', N'view_dry_dock_project_detail', N'dry_dock_project_view_details', 1, N'1', getdate(), NULL, NULL),
                                (N'3ed9b135-703c-42b9-9d6c-717967b3e7cf', N'view_dry_dock_project_detail', N'dry_dock_project_attachment_view', 1, N'1', getdate(), NULL, NULL),
                                (N'f7dd91f9-773d-40ba-9731-833d202481ef', N'view_dry_dock_project_detail_onboard', N'dry_dock_project_view_details_onboard', 1, N'1', getdate(), NULL, NULL),
                                (N'deaf7f86-3071-464f-a794-8d787977bffb', N'view_dry_dock_project_detail_onboard', N'dry_dock_project_attachment_view_onboard', 1, N'1', getdate(), NULL, NULL),
                                (N'c0ec7b7c-154a-4e26-9065-3a17ee74c095', N'edit_dry_dock_porject_detail', N'dry_dock_project_edit_header', 1, N'1', getdate(), NULL, NULL),
                                (N'89ba4c4d-e3a6-44f7-b1da-4c465de3685e', N'edit_dry_dock_porject_detail', N'dry_dock_project_edit_flow', 1, N'1', getdate(), NULL, NULL),
                                (N'c8670fd2-3241-43d4-a20d-a840b05f9cb2', N'edit_dry_dock_porject_detail', N'dry_dock_project_attachment_add', 1, N'1', getdate(), NULL, NULL),
                                (N'9839f24d-ae3c-4079-a9f1-593bfd99ae74', N'edit_dry_dock_porject_detail', N'dry_dock_project_attachment_edit', 1, N'1', getdate(), NULL, NULL),
                                (N'50d0c83c-c314-476a-861a-d31dd5d188d7', N'edit_dry_dock_porject_detail', N'dry_dock_project_attachment_delete', 1, N'1', getdate(), NULL, NULL),
                                (N'51ada4b1-5324-4e15-848a-698af1a3953b', N'edit_dry_dock_porject_detail_onboard', N'dry_dock_project_edit_header_onboard', 1, N'1', getdate(), NULL, NULL),
                                (N'1c1cbe30-a9fc-4298-b959-978ad3448d6a', N'edit_dry_dock_porject_detail_onboard', N'dry_dock_project_edit_flow_onboard', 1, N'1', getdate(), NULL, NULL),
                                (N'5f0bece0-d313-4aae-920a-db9f3d1f6f7f', N'edit_dry_dock_porject_detail_onboard', N'dry_dock_project_attachment_add_onboard', 1, N'1', getdate(), NULL, NULL),
                                (N'fa9c5344-ff7a-497f-b506-ab3791adcd7e', N'edit_dry_dock_porject_detail_onboard', N'dry_dock_project_attachment_edit_onboard', 1, N'1', getdate(), NULL, NULL),
                                (N'6f800cb9-8909-4e55-b9e8-8fa65c60f5d8', N'edit_dry_dock_porject_detail_onboard', N'dry_dock_project_attachment_delete_onboard', 1, N'1', getdate(), NULL, NULL))
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
                  USING (VALUES (N'd03b2122-1506-4f11-8f00-2bbd69906e33', @AdminRoleId, NULL, N'view_project_main', 1, getdate(), NULL, NULL, 1),
                                (N'161a6220-81af-40a8-8bf6-e83e4053562a', @AdminRoleId, NULL, N'view_project_main_onboard', 1, getdate(), NULL, NULL, 1),
                                (N'd7c22609-56fa-4db2-80f8-e29b6f3e21c4', @AdminRoleId, NULL, N'create_projects', 1, getdate(), NULL, NULL, 1),
                                (N'76c558c1-c437-485c-81a0-dbc7c60b6d1b', @AdminRoleId, NULL, N'delete_projects', 1, getdate(), NULL, NULL, 1),
                                (N'4bd02a0f-8e7a-4015-82d8-01d2bf62b41b', @AdminRoleId, NULL, N'view_dry_dock_project_detail', 1, getdate(), NULL, NULL, 1),
                                (N'6bb72c7a-8a97-49f2-9208-170225f13e53', @AdminRoleId, NULL, N'view_dry_dock_project_detail_onboard', 1, getdate(), NULL, NULL, 1),
                                (N'ede74daa-6a29-440c-a1f6-e0bfca07046e', @AdminRoleId, NULL, N'edit_dry_dock_porject_detail', 1, getdate(), NULL, NULL, 1),
                                (N'2c3624a7-413a-4409-bfa2-00a9822aa3c6', @AdminRoleId, NULL, N'edit_dry_dock_porject_detail_onboard', 1, getdate(), NULL, NULL, 1))
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
              End;
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
                  where Role = 'JiBe Crew Implementation' and Active_Status = 1
                  MERGE INTO INF_Lib_RoleGroupsRights AS TARGET
                  USING (VALUES (N'd03b2122-1506-4f11-8f00-2bbd69906e33', @JibeImplementationRoleId, NULL, N'view_project_main', 1, getdate(), NULL, NULL, 1),
                                (N'161a6220-81af-40a8-8bf6-e83e4053562a', @JibeImplementationRoleId, NULL, N'view_project_main_onboard', 1, getdate(), NULL, NULL, 1),
                                (N'd7c22609-56fa-4db2-80f8-e29b6f3e21c4', @JibeImplementationRoleId, NULL, N'create_projects', 1, getdate(), NULL, NULL, 1),
                                (N'76c558c1-c437-485c-81a0-dbc7c60b6d1b', @JibeImplementationRoleId, NULL, N'delete_projects', 1, getdate(), NULL, NULL, 1),
                                (N'4bd02a0f-8e7a-4015-82d8-01d2bf62b41b', @JibeImplementationRoleId, NULL, N'view_dry_dock_project_detail', 1, getdate(), NULL, NULL, 1),
                                (N'6bb72c7a-8a97-49f2-9208-170225f13e53', @JibeImplementationRoleId, NULL, N'view_dry_dock_project_detail_onboard', 1, getdate(), NULL, NULL, 1),
                                (N'ede74daa-6a29-440c-a1f6-e0bfca07046e', @JibeImplementationRoleId, NULL, N'edit_dry_dock_porject_detail', 1, getdate(), NULL, NULL, 1),
                                (N'2c3624a7-413a-4409-bfa2-00a9822aa3c6', @JibeImplementationRoleId, NULL, N'edit_dry_dock_porject_detail_onboard', 1, getdate(), NULL, NULL, 1))
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
              End;
             `);
            }
            await MigrationUtilsService.migrationLog(
                className,
                '',
                'S',
                'crew_accounts',
                'create access rights for j3 dry dock projects',
            );
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                className,
                JSON.stringify(error),
                'E',
                'crew_accounts',
                'create access rights for j3 dry dock projects',
                true,
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        return;
    }
}
