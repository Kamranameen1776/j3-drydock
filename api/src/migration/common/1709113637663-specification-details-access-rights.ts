import { MigrationUtilsService } from "j2utils";
import {MigrationInterface, QueryRunner} from "typeorm";
import { errorLikeToString } from "../../common/drydock/ts-helpers/error-like-to-string";

export class specificationDetailsAccessRights1709113637663 implements MigrationInterface {
    public className = this.constructor.name;
    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await MigrationUtilsService.createTableBackup('inf_lib_right');
            await MigrationUtilsService.createTableBackup('inf_lnk_right_user_type');
            await MigrationUtilsService.createTableBackup('INF_Lib_Group');
            await MigrationUtilsService.createTableBackup('INF_Lib_GroupRights');
            await MigrationUtilsService.createTableBackup('INF_Lib_RoleGroupsRights');

            await queryRunner.query(`
            MERGE INTO INF_LIB_Right AS TARGET
            USING (VALUES
                       ('8A9C0668-C196-4388-B7D5-0CC1726044C5', 'view_findings_section_onboard', 'View Findings Section in Specification', 'v', 'project', 'specification_details', 'view_findings_section_onboard', 1, getdate(), 1, NULL, 1, 'View Findings in Specification', NULL),
                       ('17724742-CB7E-42DA-A363-12D8C81E8F1E', 'view_requisition_section_onboard', 'View Requisition Section in Specification', 'v', 'project', 'specification_details', 'view_requisition_onboard', 1, getdate(), 1, NULL, 1, 'View Requisition in Specification', NULL),
                       ('AF57F155-4466-4C02-B24A-134AB2C5E626', 'delete_attachments_onboard', 'Delete attachments rights for specification', 'v', 'project', 'specification_details', 'delete_attachments_onboard', 1, getdate(), 1, NULL, 1, 'Delete Attachments in Specification', NULL),
                       ('248E5ED1-7989-410B-AE2F-18CFC9C91096', 'view_specification_detail_onboard', 'View specification detail page', 'v', 'project', 'specification_details', 'view_spec_onboard', 1, getdate(), 1, NULL, 1, 'View Specification Detail', NULL),
                       ('0DCFF97C-003B-46DB-AB81-195F8E2CA7CB', 'add_sub_items', 'Add sub items access rights for specification', 'o', 'project', 'specification_details', 'add_sub_items', 1, getdate(), 1, NULL, 1, 'Add Sub Items in Specification', '/drydock/specification-details/sub-items/create-sub-item'),
                       ('23D0B8BF-FFF7-48C7-82C8-21A4B7B5AACA', 'edit_general_information_onboard', 'Edit general information access rights for specification', 'v', 'project', 'specification_details', 'edit_gen_info_onboard', 1, getdate(), 1, NULL, 1, 'Edit General Information in Specification', NULL),
                       ('5727503A-C804-4895-AC6D-2783206BF784', 'edit_workflow_onboard', 'Edit Workflow in specification', 'v', 'project', 'specification_details', 'edit_workflow_onboard', 1, getdate(), 1, NULL, 1, 'Edit Workflow in Specification', NULL),
                       ('FCCCCE0F-CC5E-4CB6-9691-27D73B9025F6', 'delete_specification_detail_onboard', 'Delete specification detail', 'v', 'project', 'specification_details', 'delete', 1, getdate(), 1, NULL, 1, 'Delete Specification Detail', NULL),
                       ('C9510BB1-8391-4268-BE9A-283E9DCAABA4', 'view_attachments_section_onboard', 'View attachments rights for project dry dock', 'v', 'project', 'specification_details', 'view_attachments_onboard', 1, getdate(), 1, NULL, 1, 'View Attachments in Specification', NULL),
                       ('F623ECB1-D71E-4BF8-BE20-30A617356CB6', 'add_attachments_onboard', 'Add attachments rights for specification', 'v', 'project', 'specification_details', 'add_attachments_onboard', 1, getdate(), 1, NULL, 1, 'Add Attachments in Specification', NULL),
                       ('6E042F4C-6590-41B5-8578-338FBED53F44', 'delete_sub_items_onboard', 'Delete sub items access rights for specification', 'v', 'project', 'specification_details', 'delete_sub_items_onboard', 1, getdate(), 1, NULL, 1, 'Delete Sub Items in Specification', NULL),
                       ('3A6AF4D8-7E51-414F-91F8-37CEAFC7BA25', 'view_attachments_section', 'View attachments rights for project dry dock', 'o', 'project', 'specification_details', 'view_attachments_section', 1, getdate(), 1, NULL, 1, 'View Attachments in Specification', '/jms/jms_attachment/getJmsAttachmentDetails'),
                       ('0F5B5B2E-369D-4C9B-9545-38C5A2B25213', 'edit_requisition', 'Edit Requisition access rights for specification', 'o', 'project', 'specification_details', 'edit_requisition', 1, getdate(), 1, NULL, 1, 'Edit Requisition in Specification', NULL),
                       ('20FDC417-FCDA-4869-BCF0-4119E03F82A4', 'edit_workflow', 'Edit Workflow in specification', 'o', 'project', 'specification_details', 'edit_general_information', 1, getdate(), 1, NULL, 1, 'Edit Workflow in Specification', NULL),
                       ('4A43BEE2-B4F6-40F1-B506-48F9660E9B92', 'edit_general_information', 'Edit general information access rights for specification', 'o', 'project', 'specification_details', 'edit_general_information', 1, getdate(), 1, NULL, 1, 'Edit General Information in Specification', '/drydock/specification-details/update-specification-details'),
                       ('9746E187-6931-4C7B-B154-50A8BAE422EE', 'view_pms_jobs_tab', 'View PMS Jobs tab in Specification', 'o', 'project', 'specification_details', 'view_pms_jobs_tab', 1, getdate(), 1, NULL, 1, 'View PMS Jobs in Specification', NULL),
                       ('52BE32D8-C661-4D58-8A29-5A0EBDEE6068', 'delete_specification_detail', 'Delete specification detail', 'o', 'project', 'specification_details', 'delete', 1, getdate(), 1, NULL, 1, 'Delete Specification Detail', '/drydock/specification-details/delete-specification-details'),
                       ('8EC05117-9F98-44F8-9C27-5F42AB0EF41F', 'view_findings_section', 'View Findings Section in Specification', 'o', 'project', 'specification_details', 'view_findings_section', 1, getdate(), 1, NULL, 1, 'View Findings in Specification', '/task-manager/task-manager-main/get-tm-findings-task-list'),
                       ('542D4F69-361B-4611-9EB8-675B5078A58D', 'view_specification_detail', 'View specification detail page', 'o', 'project', 'specification_details', 'view_spec', 1, getdate(), 1, NULL, 1, 'View Specification Detail', '/drydock/specification-details/get-specification-details'),
                       ('812AD6AE-8950-43AE-AE99-730690F0517F', 'edit_header_section_onboard', 'Edit header section in specification', 'v', 'project', 'specification_details', 'edit_header_section_onboard', 1, getdate(), 1, NULL, 1, 'Edit Header Section of Specification', NULL),
                       ('F098C80B-FE09-4E7B-88FB-73DB3B084178', 'edit_header_section', 'Edit header section in specification', 'o', 'project', 'specification_details', 'edit_header_section', 1, getdate(), 1, NULL, 1, 'Edit Header Section of Specification', '/drydock/specification-details/update-specification-details'),
                       ('7AA97778-8663-4FFD-9B08-7CBCCBA11D2C', 'add_sub_items_onboard', 'Add sub items access rights for specification', 'v', 'project', 'specification_details', 'add_sub_items_onboard', 1, getdate(), 1, NULL, 1, 'Add Sub Items in Specification', NULL),
                       ('B984E047-8679-4864-94E2-7CC6A1D259FB', 'view_sub_items_section_onboard', 'View Sub Items Section in Specification', 'v', 'project', 'specification_details', 'view_sub_items_section_onboard', 1, getdate(), 1, NULL, 1, 'View Sub Items in Specification', NULL),
                       ('29FB7EFE-83E3-495C-AB06-7E0B693E3936', 'edit_attachments', 'Edit attachments rights for specification', 'o', 'project', 'specification_details', 'edit_attachments', 1, getdate(), 1, NULL, 1, 'Edit Attachments in Specification', '/infra/file/updateFileDetail'),
                       ('11C1DDC8-8D36-48BE-A4E2-6CBF416E4F97', 'delete_sub_items', 'Delete sub items access rights for specification', 'o', 'project', 'specification_details', 'delete_sub_items', 1, getdate(), 1, NULL, 1, 'Delete Sub Items in Specification', '/drydock/specification-details/sub-items/delete-sub-item'),
                       ('D1019F3E-4931-4906-8372-71189903D495', 'view_requisition_section', 'View Requisition Section in Specification', 'o', 'project', 'specification_details', 'view_requisition_section', 1, getdate(), 1, NULL, 1, 'View Requisition in Specification', NULL),
                       ('6C692C98-26B4-4627-8603-87F69FFE3DDA', 'resync_record', 'Re-Sync the record to other side in Specification', 'o', 'project', 'specification_details', 'resync', 1, getdate(), 1, NULL, 1, 'Re-Sync Record for Specification', NULL),
                       ('5F5E7553-D662-4821-83C1-8A0FE6A7D7CC', 'edit_requisition_onboard', 'Edit Requisition access rights for specification', 'v', 'project', 'specification_details', 'edit_requisition_onboard', 1, getdate(), 1, NULL, 1, 'Edit Requisition in Specification', NULL),
                       ('E78179A6-1FA3-47D8-91AC-8F8AE3C3509F', 'add_attachments', 'Add attachments rights for specification', 'o', 'project', 'specification_details', 'add_attachments', 1, getdate(), 1, NULL, 1, 'Add Attachments in Specification', '/infra/file/upload'),
                       ('3C31C413-5651-4CDA-A14C-933B84DAD97A', 'edit_attachments_onboard', 'Edit attachments rights for specification', 'v', 'project', 'specification_details', 'edit_attachments_onboard', 1, getdate(), 1, NULL, 1, 'Edit Attachments in Specification', NULL),
                       ('177DA4F5-AB2C-49B7-9018-9442EB395C38', 'view_general_information_section_onboard', 'View General Information Section in Specification', 'v', 'project', 'specification_details', 'view_gen_info_section_onboard', 1, getdate(), 1, NULL, 1, 'View General Information in Specification', NULL),
                       ('EF48B6A0-B199-45E6-9283-95D21304EF5E', 'delete_attachments', 'Delete attachment rights for specification', 'o', 'project', 'specification_details', 'delete_attachments', 1, getdate(), 1, NULL, 1, 'Delete Attachment in Specification', '/infra/file/updateFileDetail'),
                       ('0B404328-13A0-4312-A8A1-982544A4DBBE', 'view_sub_items_section', 'View Sub Items Section in Specification', 'o', 'project', 'specification_details', 'view_sub_items_section', 1, getdate(), 1, NULL, 1, 'View Sub Items in Specification', '/drydock/specification-details/sub-items/find-sub-items'),
                       ('96030422-8BB1-4F53-8A4F-9F6FD49CCD7B', 'edit_sub_items_onboard', 'Edit sub items access rights for specification', 'v', 'project', 'specification_details', 'edit_sub_items_onboard', 1, getdate(), 1, NULL, 1, 'Edit Sub Items in Specification', NULL),
                       ('B8E35313-00D5-4188-84F4-B29406E64E60', 'view_pms_jobs_tab_onboard', 'View PMS Jobs tab in Specification', 'v', 'project', 'specification_details', 'view_pms_jobs_tab_onboard', 1, getdate(), 1, NULL, 1, 'View PMS Jobs in Specification', NULL),
                       ('E23AB67E-6A5D-4CFA-BF7B-CE1D9A879AF8', 'view_general_information_section', 'View General Information Section in Specification', 'o', 'project', 'specification_details', 'view_gen_info_section', 1, getdate(), 1, NULL, 1, 'View General Information in Specification', '/drydock/specification-details/update-specification-details'),
                       ('5712F513-72C9-4EDC-85AF-D9B4C6BA2A98', 'resync_record_onboard', 'Re-Sync the record to other side in Specification', 'v', 'project', 'specification_details', 'resync', 1, getdate(), 1, NULL, 1, 'Re-Sync Record for Specification', NULL),
                       ('899C004D-135B-4AEB-96EF-FF69AEF71980', 'edit_sub_items', 'Edit sub items access rights for specification', 'o', 'project', 'specification_details', 'edit_sub_items', 1, getdate(), 1, NULL, 1, 'Edit Sub Items in Specification', '/drydock/specification-details/sub-items/update-sub-item')
                       )


               AS SOURCE ([Right_UID], [Right_Code], [Right_Description], [Valid_On], [Module_Code],
                               [Function_Code], [Action], [Created_By], [Date_Of_Creation], [Modified_By], [Date_Of_Modification],
                               [Active_Status], [right_name], [api_url])

               ON TARGET.[Right_UID] = SOURCE.[Right_UID]
               WHEN MATCHED THEN
                   UPDATE SET
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
            USING (VALUES
                ('EA908987-A7B0-4414-9800-E29D8BE9B5A3', 'view_findings_section_onboard','0F3613B9-9FB5-40E6-8763-FC4941136598', 1, 1, getdate(), 1, NULL),
                ('3826C872-9D95-4DC4-8A05-8D31C601FA5E', 'view_requisition_section_onboard','0F3613B9-9FB5-40E6-8763-FC4941136598', 1, 1, getdate(), 1, NULL),
                ('2DE76991-6CAB-480E-90CD-4B7B8BCFA458', 'delete_attachments_onboard','0F3613B9-9FB5-40E6-8763-FC4941136598', 1, 1, getdate(), 1, NULL),
                ('AFDD7A1A-BC68-4049-931E-C1BDE8521BF5', 'view_specification_detail_onboard','0F3613B9-9FB5-40E6-8763-FC4941136598', 1, 1, getdate(), 1, NULL),
                ('33B400A5-D7F3-43EA-A518-CC9A7053F8FB', 'add_sub_items','3C084885-783B-46B8-9635-B2F70CC49218', 1, 1, getdate(), 1, NULL),
                ('C408D7B4-5DA7-467B-91D8-72DA44E007F2', 'edit_general_information_onboard','0F3613B9-9FB5-40E6-8763-FC4941136598', 1, 1, getdate(), 1, NULL),
                ('E9E6FF17-D19F-4973-A129-C74E0E30819D', 'edit_workflow_onboard','0F3613B9-9FB5-40E6-8763-FC4941136598', 1, 1, getdate(), 1, NULL),
                ('E4587AF2-A569-4E32-9E61-D9582C3AEA0A', 'delete_specification_detail_onboard','0F3613B9-9FB5-40E6-8763-FC4941136598', 1, 1, getdate(), 1, NULL),
                ('E41F1170-7F96-480F-AA1E-B32D2F3F757A', 'view_attachments_section_onboard','0F3613B9-9FB5-40E6-8763-FC4941136598', 1, 1, getdate(), 1, NULL),
                ('E2C8DB1A-E131-47FA-BE9D-099E793BC9DD', 'add_attachments_onboard','0F3613B9-9FB5-40E6-8763-FC4941136598', 1, 1, getdate(), 1, NULL),
                ('45E17520-B965-45FF-8962-D341D2B169B6', 'delete_sub_items_onboard','0F3613B9-9FB5-40E6-8763-FC4941136598', 1, 1, getdate(), 1, NULL),
                ('BA9635A5-22CA-4F0C-AADD-DB27144B3BC9', 'view_attachments_section','3C084885-783B-46B8-9635-B2F70CC49218', 1, 1, getdate(), 1, NULL),
                ('62B1A49C-3C48-4030-A2A4-C260E3E9E355', 'edit_requisition','3C084885-783B-46B8-9635-B2F70CC49218', 1, 1, getdate(), 1, NULL),
                ('319B6DD0-FD24-47F9-867E-1EFFF1C1F110', 'edit_workflow','3C084885-783B-46B8-9635-B2F70CC49218', 1, 1, getdate(), 1, NULL),
                ('DD094C68-FAFA-48E1-BB32-DFAD4B2806A5', 'edit_general_information','3C084885-783B-46B8-9635-B2F70CC49218', 1, 1, getdate(), 1, NULL),
                ('E509C691-5A24-4989-9F63-8859D042FE82', 'view_pms_jobs_tab','3C084885-783B-46B8-9635-B2F70CC49218', 1, 1, getdate(), 1, NULL),
                ('7FD30454-11E6-4559-9419-69D822389A7E', 'delete_specification_detail','3C084885-783B-46B8-9635-B2F70CC49218', 1, 1, getdate(), 1, NULL),
                ('87EE73CF-9E04-45C3-9BA7-E28F66096F40', 'view_findings_section','3C084885-783B-46B8-9635-B2F70CC49218', 1, 1, getdate(), 1, NULL),
                ('4A5383B0-0460-4976-A077-BDA7439B7E37', 'view_specification_detail', '3C084885-783B-46B8-9635-B2F70CC49218', 1, 1, getdate(), NULL, NULL),
                ('5589678D-6DB7-49BA-9950-C1F26C4F4358', 'edit_header_section_onboard', '0F3613B9-9FB5-40E6-8763-FC4941136598', 1, 1, getdate(), NULL, NULL),
                ('2E52A0F1-80FE-4869-8446-72EA5A54996D', 'edit_header_section', '3C084885-783B-46B8-9635-B2F70CC49218', 1, 1, getdate(), NULL, NULL),
				('3134A455-D4E8-4BDD-BD3A-0FE100F3AB37', 'add_sub_items_onboard','0F3613B9-9FB5-40E6-8763-FC4941136598', 1, 1, getdate(), 1, NULL),
                ('6424E039-60E8-487F-BF7F-C0851F848FEF', 'view_sub_items_section_onboard','0F3613B9-9FB5-40E6-8763-FC4941136598', 1, 1, getdate(), 1, NULL),
                ('3ACA4551-CA06-4223-957C-A1F4A6EA4C1C', 'edit_attachments','3C084885-783B-46B8-9635-B2F70CC49218', 1, 1, getdate(), 1, NULL),
                ('8AAD40DD-E814-4E21-9DEA-995D9F74366F', 'delete_sub_items','3C084885-783B-46B8-9635-B2F70CC49218', 1, 1, getdate(), 1, NULL),
                ('C382B7FE-00B7-45C5-8B3E-2B3ED2C7909A', 'view_requisition_section', '3C084885-783B-46B8-9635-B2F70CC49218', 1, 1, getdate(), NULL, NULL),
                ('EC287E07-A64E-462A-96F1-1FC6BF7AE284', 'resync_record', '3C084885-783B-46B8-9635-B2F70CC49218', 1, 1, getdate(), NULL, NULL),
                ('585B3491-74BF-4B8E-B9AA-4091925DED0A', 'edit_requisition_onboard', '0F3613B9-9FB5-40E6-8763-FC4941136598', 1, 1, getdate(), NULL, NULL),
				('93B98611-A62E-4640-8975-60818886765E', 'add_attachments','3C084885-783B-46B8-9635-B2F70CC49218', 1, 1, getdate(), 1, NULL),
                ('40FF29EA-FBA1-41A2-A106-600BC61DA443', 'edit_attachments_onboard','0F3613B9-9FB5-40E6-8763-FC4941136598', 1, 1, getdate(), 1, NULL),
                ('BA6E1B58-FD48-4BD1-8236-E24580DE1BD3', 'view_general_information_section_onboard','0F3613B9-9FB5-40E6-8763-FC4941136598', 1, 1, getdate(), 1, NULL),
                ('3E866EA0-E16C-4DF8-910C-0260A7003A7C', 'delete_attachments','3C084885-783B-46B8-9635-B2F70CC49218', 1, 1, getdate(), 1, NULL),
                ('80300DB1-1586-4922-B7B5-8B899B18A45D', 'view_sub_items_section', '3C084885-783B-46B8-9635-B2F70CC49218', 1, 1, getdate(), NULL, NULL),
                ('F524CA7B-EA3E-4D04-8F82-7FE90F602B2B', 'edit_sub_items_onboard', '0F3613B9-9FB5-40E6-8763-FC4941136598', 1, 1, getdate(), NULL, NULL),
                ('15EC3531-1016-4B14-BEC1-CAB1C3CF9771', 'view_pms_jobs_tab_onboard', '0F3613B9-9FB5-40E6-8763-FC4941136598', 1, 1, getdate(), NULL, NULL),
				('7CDC7138-49F7-4BFD-91F7-16215D0F51BD', 'view_general_information_section', '3C084885-783B-46B8-9635-B2F70CC49218', 1, 1, getdate(), NULL, NULL),
                ('98C5E935-AC2B-4839-82A4-0E31CABC1F6B', 'resync_record_onboard', '0F3613B9-9FB5-40E6-8763-FC4941136598', 1, 1, getdate(), NULL, NULL),
                ('CD31BB7F-AB17-4A06-913D-B907B3420FFD', 'edit_sub_items', '3C084885-783B-46B8-9635-B2F70CC49218', 1, 1, getdate(), NULL, NULL)
                )

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
            USING (VALUES
                ('3845DAAF-F73C-4CB4-A6DA-5E0B01AC445A', 'delete_specification_onboard', 'Delete access rights for specification onboard', 1, getdate(), null, null, 1, 'Delete Specification Onboard', '0F3613B9-9FB5-40E6-8763-FC4941136598'),
                ('C788122C-31C5-4617-BCF2-978559E9AC80', 'edit_specification_detail', 'Edit access right for specification detail page', 1, getdate(), null, null, 1, 'Edit Specification Detail', '3C084885-783B-46B8-9635-B2F70CC49218'),
                ('1E2E4EC3-E2DF-462D-8A4F-A0C64FBE88AE', 'edit_specification_detail_onboard', 'Edit access right for specification detail page onboard', 1, getdate(), null, null, 1, 'Edit Specification Detail Onboard', '0F3613B9-9FB5-40E6-8763-FC4941136598'),
                ('E32FE5EC-243A-4841-95E1-A1F5C4D16380', 'view_specification_detail', 'View access rights for specification detail', 1, getdate(), null, null, 1, 'View Specification Detail', '3C084885-783B-46B8-9635-B2F70CC49218'),
                ('0783A5B8-7631-465B-8AD8-A98BB910EE08', 'view_specification_detail_onboard', 'View access rights for specification detail onboard', 1, getdate(), null, null, 1, 'View Specification Detail Onboard', '0F3613B9-9FB5-40E6-8763-FC4941136598'),
                ('91D01CC0-D182-409D-988A-C3BACB9D8230', 'delete_specification', 'Delete access rights for specification', 1, getdate(), null, null, 1, 'Delete Specification', '3C084885-783B-46B8-9635-B2F70CC49218'),
				('5DC0D4C2-0439-4F4C-A08F-82A3A2A1837E', '22658ABD-CE04-420E-8582-25C52CD9615E', 'Re-Sync Record - Office', 1, getdate(), null, null, 1, 'Task Manager Re-Sync', '3C084885-783B-46B8-9635-B2F70CC49218'),
                ('62766649-2C34-4E89-B757-6B5E35ADC0D1', 'C2DBEC6D-1D60-4F3C-AC23-DF76FD073FDE', 'Re-Sync Record - Onboard', 1, getdate(), null, null, 1, 'Task Manager Re-Sync Onboard', '0F3613B9-9FB5-40E6-8763-FC4941136598')
				)

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
            USING (VALUES
                (N'78877EFE-D637-464A-8704-6FC271838CCD', N'view_specification_detail_onboard', N'view_findings_section_onboard', 1, 1, getdate(), NULL, NULL),
				(N'06D503DC-F0E8-4AB7-AED5-080747036E54', N'view_specification_detail_onboard', N'view_requisition_section_onboard', 1, 1, getdate(), NULL, NULL),
                (N'9CBF90CF-4FAC-4578-A5A6-636DE94B6599', N'edit_specification_detail_onboard', N'delete_attachments_onboard', 1, 1, getdate(), NULL, NULL),
                (N'36C29322-F1F3-4F91-81BF-66A1AC0472AE', N'view_specification_detail_onboard', N'view_specification_detail_onboard', 1, 1, getdate(), NULL, NULL),
                (N'A0159D7B-A600-474C-9EB5-04CE2B5BC880', N'edit_specification_detail', N'add_sub_items', 1, 1, getdate(), NULL, NULL),
                (N'45406201-EEFC-48D7-8FD5-4B92B65869A3', N'edit_specification_detail_onboard', N'edit_general_information_onboard', 1, 1, getdate(), NULL, NULL),
                (N'E023C7D4-1A13-4E4A-A32E-8BEF4D9605DC', N'edit_specification_detail_onboard', N'edit_workflow_onboard', 1, 1, getdate(), NULL, NULL),
                (N'4B0DBED6-55AC-4FA4-8BD3-254F51138144', N'delete_specification_onboard', N'delete_specification_detail_onboard', 1, 1, getdate(), NULL, NULL),
			    (N'FB97FE89-AA70-4A5D-BD9C-2A5101CFC3D1', N'view_specification_detail_onboard', N'view_attachments_section_onboard', 1, 1, getdate(), NULL, NULL),
                (N'BC36A0A7-6D54-4AC7-9A88-3BF89578D3A1', N'edit_specification_detail_onboard', N'add_attachments_onboard', 1, 1, getdate(), NULL, NULL),
                (N'3C2A2156-E639-4134-A667-7EF2EA770B76', N'edit_specification_detail_onboard', N'delete_sub_items_onboard', 1, 1, getdate(), NULL, NULL),
                (N'9488AF30-B2DF-4059-947A-E6650E4A0EC5', N'view_specification_detail', N'view_attachments_section', 1, 1, getdate(), NULL, NULL),
				(N'A5E5B4BC-9D39-44D6-815C-C90D98FD15FC', N'edit_specification_detail', N'edit_requisition', 1, 1, getdate(), NULL, NULL),
                (N'D6117C8E-55D2-4C6C-B074-EC3A5827FE97', N'edit_specification_detail', N'edit_workflow', 1, 1, getdate(), NULL, NULL),
                (N'86DF611C-B9E9-458F-92D2-039583F84C10', N'edit_specification_detail', N'edit_general_information', 1, 1, getdate(), NULL, NULL),
                (N'439E0C7A-3B3C-4A0E-A841-2353E8D33145', N'view_specification_detail', N'view_pms_jobs_tab', 1, 1, getdate(), NULL, NULL),
				(N'1D71286D-874C-4812-BF45-30A9C562711F', N'delete_specification', N'delete_specification_detail', 1, 1, getdate(), NULL, NULL),
				(N'65A34B8E-9574-4A55-991E-01777F62C1A6', N'view_specification_detail', N'view_findings_section', 1, 1, getdate(), NULL, NULL),
                (N'E2817682-424E-4157-90AB-9629ECC3C5F7', N'view_specification_detail', N'view_specification_detail', 1, 1, getdate(), NULL, NULL),
                (N'5795A65C-FB17-4584-B9EB-BE8BEC8668B4', N'edit_specification_detail_onboard', N'edit_header_section_onboard', 1, 1, getdate(), NULL, NULL),
				(N'9648F521-AAFE-4A67-8F11-C5DF9A718A68', N'edit_specification_detail', N'edit_header_section', 1, 1, getdate(), NULL, NULL),
				(N'2FB01D4D-9FB0-4A91-8674-B5F4AD12DF69', N'edit_specification_detail_onboard', N'add_sub_items_onboard', 1, 1, getdate(), NULL, NULL),
				(N'273D4B12-29EC-4CFA-92C3-D51BD3333858', N'view_specification_detail_onboard', N'view_sub_items_section_onboard', 1, 1, getdate(), NULL, NULL),
                (N'25FBA7C4-708F-46CA-857E-C50D8293E330', N'edit_specification_detail', N'edit_attachments', 1, 1, getdate(), NULL, NULL),
				(N'CD6EF952-65E0-494F-BE25-9C1CF8DFC826', N'edit_specification_detail', N'delete_sub_items', 1, 1, getdate(), NULL, NULL),
				(N'A5DB1F58-F0D4-462E-90E5-24C1E113AB93', N'view_specification_detail', N'view_requisition_section', 1, 1, getdate(), NULL, NULL),
                (N'6A18F493-B0B1-405F-A328-DBE50342F7C0', N'task_manager_resync', N'resync_record', 1, 1, getdate(), NULL, NULL),
				(N'9301C2DD-0A9E-4FD3-90F9-F5FA22B41297', N'edit_specification_detail_onboard', N'edit_requisition_onboard', 1, 1, getdate(), NULL, NULL),
				(N'A40B17BA-A74E-477A-9F57-443881358217', N'edit_specification_detail', N'add_attachments', 1, 1, getdate(), NULL, NULL),
                (N'5DFED7F8-A25A-4219-B9C3-5D00B9FC84C6', N'edit_specification_detail_onboard', N'edit_attachments_onboard', 1, 1, getdate(), NULL, NULL),
				(N'B3AEB5B2-E1F5-436B-A88B-4C9ACD9254DA', N'view_specification_detail_onboard', N'view_general_information_section_onboard', 1, 1, getdate(), NULL, NULL),
				(N'E33E6DC9-9EA9-4A72-9AFE-4363F1B77329', N'edit_specification_detail', N'delete_attachments', 1, 1, getdate(), NULL, NULL),
                (N'29D98CB1-8D27-460D-954F-5C13CBD19248', N'view_specification_detail', N'view_sub_items_section', 1, 1, getdate(), NULL, NULL),
				(N'49402FB8-A1BF-4D2D-A167-19D599323AAA', N'edit_specification_detail_onboard', N'edit_sub_items_onboard', 1, 1, getdate(), NULL, NULL),
				(N'D3267A2D-F4AD-48F2-9F21-EC6AC8AAAFB2', N'view_specification_detail_onboard', N'view_pms_jobs_tab_onboard', 1, 1, getdate(), NULL, NULL),
				(N'9F92D96B-BD08-444E-A716-29DD7194FFB6', N'view_specification_detail', N'view_general_information_section', 1, 1, getdate(), NULL, NULL),
				(N'49D9E1EE-0C62-4704-AB06-26E8A0BBCD0C', N'task_manager_resync_onboard', N'resync_record_onboard', 1, 1, getdate(), NULL, NULL),
                (N'AD449116-8DD3-4F73-B1F6-502CE9AD32E9', N'edit_specification_detail', N'edit_sub_items', 1, 1, getdate(), NULL, NULL)
                )

            AS SOURCE ([GR_UID], [GR_Group_Code], [GR_Right_Code], [Active_Status], [created_by],
                           [date_of_creation], [modified_by], [date_of_modification])

            ON TARGET.GR_UID = SOURCE.GR_UID

            WHEN MATCHED THEN
                UPDATE SET
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
            ----Access Groups mapping to Master role, C/E role and C/O ranks

            Declare @seastaff_user_uid uniqueidentifier,@master_role int
            select top 1 @seastaff_user_uid=uid from LIB_USER_TYPE where USER_TYPE='SEA STAFF' and active_status=1
            select top 1 @master_role=Role_ID from inf_lib_roles where role='Master' and user_type_uid=@seastaff_user_uid and active_status=1

            Declare @view_spec_detail_groupcode_onb varchar(150),@edit_spec_detail_groupcode_onb varchar(150),@delete_spec_groupcode_onb varchar(150)

            select @view_spec_detail_groupcode_onb=Group_Code from inf_lib_group where group_name='View Specification Detail Onboard' and active_status=1
            select @edit_spec_detail_groupcode_onb=Group_Code from inf_lib_group where group_name='Edit Specification Detail Onboard' and active_status=1
            select @delete_spec_groupcode_onb=Group_Code from inf_lib_group where group_name='Delete Specification Onboard' and active_status=1

            IF @master_role is not null
            Begin

            MERGE INTO inf_lib_rolegroupsrights AS TARGET USING (
            VALUES
                (N'3710E5AD-8DFD-4027-B2E6-08BFB059FBD6', @master_role,NULL, @view_spec_detail_groupcode_onb,1,getdate(),NULL,NULL,1),
                (N'BB0A66D4-8BFB-4FFD-952B-9813E4BA8AD0', @master_role,NULL, @edit_spec_detail_groupcode_onb,1,getdate(),NULL,NULL,1),
                (N'AD8A55CD-BA80-42AC-8E3B-EB9F2598C1D9', @master_role,NULL, @delete_spec_groupcode_onb,1,getdate(),NULL,NULL,1)
                )

            AS SOURCE (RGR_UID,RGR_Role_ID,RGR_Right_Code,RGR_Group_Code,Created_By,Date_Of_Creation,Modified_By,Date_Of_Modification,Active_Status)

            ON TARGET.[RGR_UID] = SOURCE.[RGR_UID]

            WHEN MATCHED THEN
            UPDATE SET
            TARGET.[RGR_Right_Code] = SOURCE.[RGR_Right_Code],
            TARGET.[RGR_Group_Code] = SOURCE.[RGR_Group_Code],
            TARGET.[Modified_By] = 1 ,
            TARGET.[Date_Of_Modification] = getdate() ,
            TARGET.[Active_Status] = SOURCE.[Active_Status]

            WHEN NOT MATCHED BY TARGET THEN
            INSERT (RGR_UID,RGR_Role_ID,RGR_Right_Code,RGR_Group_Code,Created_By,Date_Of_Creation,Active_Status)
            VALUES (
            SOURCE.[RGR_UID],
            SOURCE.[RGR_Role_ID],
            SOURCE.[RGR_Right_Code],
            SOURCE.[RGR_Group_Code],
            SOURCE.[Created_By], SOURCE.[Date_Of_Creation],SOURCE.[Active_Status]);
            End


            Declare @ce_role int
            select top 1 @seastaff_user_uid=uid from LIB_USER_TYPE where USER_TYPE='SEA STAFF' and active_status=1
            select top 1 @ce_role=Role_ID from inf_lib_roles where role='C/E' and user_type_uid=@seastaff_user_uid and active_status=1
            IF @ce_role is not null
            Begin

            MERGE INTO inf_lib_rolegroupsrights AS TARGET USING (
            VALUES
                (N'6DA82789-57F8-4830-B67A-CAEE456517EE', @ce_role,NULL, @view_spec_detail_groupcode_onb,1,getdate(),NULL,NULL,1),
                (N'36103B64-9B7E-4729-970F-769527B580C3', @ce_role,NULL, @edit_spec_detail_groupcode_onb,1,getdate(),NULL,NULL,1),
                (N'4A9FE6F4-5FF3-44EF-8911-02B2F1712323', @ce_role,NULL, @delete_spec_groupcode_onb,1,getdate(),NULL,NULL,1)
                )

            AS SOURCE (RGR_UID,RGR_Role_ID,RGR_Right_Code,RGR_Group_Code,Created_By,Date_Of_Creation,Modified_By,Date_Of_Modification,Active_Status)

            ON TARGET.[RGR_UID] = SOURCE.[RGR_UID]

            WHEN MATCHED THEN
            UPDATE SET
            TARGET.[RGR_Right_Code] = SOURCE.[RGR_Right_Code],
            TARGET.[RGR_Group_Code] = SOURCE.[RGR_Group_Code],
            TARGET.[Modified_By] = 1 ,
            TARGET.[Date_Of_Modification] = getdate() ,
            TARGET.[Active_Status] = SOURCE.[Active_Status]

            WHEN NOT MATCHED BY TARGET THEN
            INSERT (RGR_UID,RGR_Role_ID,RGR_Right_Code,RGR_Group_Code,Created_By,Date_Of_Creation,Active_Status)
            VALUES (
            SOURCE.[RGR_UID],
            SOURCE.[RGR_Role_ID],
            SOURCE.[RGR_Right_Code],
            SOURCE.[RGR_Group_Code],
            SOURCE.[Created_By], SOURCE.[Date_Of_Creation],SOURCE.[Active_Status]);
            End


            Declare @co_role int
            select top 1 @seastaff_user_uid=uid from LIB_USER_TYPE where USER_TYPE='SEA STAFF' and active_status=1
            select top 1 @co_role=Role_ID from inf_lib_roles where role='C/O' and user_type_uid=@seastaff_user_uid and active_status=1
            IF @co_role is not null
            Begin

            MERGE INTO inf_lib_rolegroupsrights AS TARGET USING (
            VALUES
                (N'044555CD-D3CB-4BAF-88C5-BDA0E424DC77', @co_role,NULL, @view_spec_detail_groupcode_onb,1,getdate(),NULL,NULL,1),
                (N'05749A40-7338-410D-8357-C75A229ECBF5', @co_role,NULL, @edit_spec_detail_groupcode_onb,1,getdate(),NULL,NULL,1),
                (N'482257DA-9573-4FEB-9E90-12811F3BB455', @co_role,NULL, @delete_spec_groupcode_onb,1,getdate(),NULL,NULL,1)
                )
            AS SOURCE (RGR_UID,RGR_Role_ID,RGR_Right_Code,RGR_Group_Code,Created_By,Date_Of_Creation,Modified_By,Date_Of_Modification,Active_Status)

            ON TARGET.[RGR_UID] = SOURCE.[RGR_UID]

            WHEN MATCHED THEN
            UPDATE SET
            TARGET.[RGR_Right_Code] = SOURCE.[RGR_Right_Code],
            TARGET.[RGR_Group_Code] = SOURCE.[RGR_Group_Code],
            TARGET.[Modified_By] = 1,
            TARGET.[Date_Of_Modification] = getdate(),
            TARGET.[Active_Status] = SOURCE.[Active_Status]

            WHEN NOT MATCHED BY TARGET THEN
            INSERT (RGR_UID,RGR_Role_ID,RGR_Right_Code,RGR_Group_Code,Created_By,Date_Of_Creation,Active_Status)
            VALUES (
            SOURCE.[RGR_UID],
            SOURCE.[RGR_Role_ID],
            SOURCE.[RGR_Right_Code],
            SOURCE.[RGR_Group_Code],
            SOURCE.[Created_By], SOURCE.[Date_Of_Creation],SOURCE.[Active_Status]);
            End
            `);

            await queryRunner.query(`
            -- Access Groups mapping to Client Admin and JiBe Admin roles
            ----------************************************************************SCRIPT FOR Client Admin*******************************------------

            Declare @office_user_uid uniqueidentifier,@client_ad_role int
            select top 1 @office_user_uid=uid from LIB_USER_TYPE where USER_TYPE='OFFICE USER' and active_status=1
            select top 1 @client_ad_role=Role_ID from inf_lib_roles where role='Client Admin' and user_type_uid=@office_user_uid and active_status=1
            IF @client_ad_role is not null

            Begin

            Declare @view_spec_detail_groupcode varchar(150),@edit_spec_detail_groupcode varchar(150),@delete_spec_groupcode varchar(150)

            select @view_spec_detail_groupcode=Group_Code from inf_lib_group where group_name='View Specification Detail - Office' and active_status=1
            select @edit_spec_detail_groupcode=Group_Code from inf_lib_group where group_name='Edit Specification Detail' and active_status=1
            select @delete_spec_groupcode=Group_Code from inf_lib_group where group_name='Delete Specification' and active_status=1

            MERGE INTO inf_lib_rolegroupsrights AS TARGET USING (
            VALUES
                (N'304B69A9-6A7B-40FA-A3A3-4A601D73D288', @client_ad_role, NULL, @view_spec_detail_groupcode,1,getdate(),NULL,NULL,1),
                (N'2384B078-99F9-4F97-BC06-4BE873A9D2E5', @client_ad_role, NULL, @edit_spec_detail_groupcode,1,getdate(),NULL,NULL,1),
                (N'F4F4CF4F-5EDC-494C-A94E-02DDC9D354FF', @client_ad_role, NULL, @delete_spec_groupcode,1,getdate(),NULL,NULL,1)
                 )

            AS SOURCE (RGR_UID,RGR_Role_ID,RGR_Right_Code,RGR_Group_Code,Created_By,Date_Of_Creation,Modified_By,Date_Of_Modification,Active_Status)

            ON TARGET.[RGR_UID] = SOURCE.[RGR_UID]

            WHEN MATCHED THEN
            UPDATE SET
            TARGET.[RGR_Right_Code] = SOURCE.[RGR_Right_Code],
            TARGET.[RGR_Group_Code] = SOURCE.[RGR_Group_Code],
            TARGET.[Modified_By] = 1,
            TARGET.[Date_Of_Modification] = getdate(),
            TARGET.[Active_Status] = SOURCE.[Active_Status]

            WHEN NOT MATCHED BY TARGET THEN
            INSERT (RGR_UID,RGR_Role_ID,RGR_Right_Code,RGR_Group_Code,Created_By,Date_Of_Creation,Active_Status)
            VALUES (
            SOURCE.[RGR_UID],
            SOURCE.[RGR_Role_ID],
            SOURCE.[RGR_Right_Code],
            SOURCE.[RGR_Group_Code],
            SOURCE.[Created_By], SOURCE.[Date_Of_Creation],SOURCE.[Active_Status]);
            End

           ----------************************************************************SCRIPT FOR JiBe Admin*******************************------------
            Declare @jibe_crew_role int
            select top 1  @office_user_uid=uid from LIB_USER_TYPE where USER_TYPE='OFFICE USER' and active_status=1
            select top 1 @jibe_crew_role=Role_ID from inf_lib_roles where role='JiBe Crew Implementation' and user_type_uid=@office_user_uid and active_status=1

            IF @jibe_crew_role is not null
            Begin

                MERGE INTO inf_lib_rolegroupsrights AS TARGET USING (
                VALUES
                    ('73D22832-34E5-4C71-9B14-17E4D1F6ACEA', @jibe_crew_role, NULL, @view_spec_detail_groupcode,1,getdate(),NULL,NULL,1),
                    ('48B70AF3-C75C-41AB-9BB5-65656F023A05', @jibe_crew_role, NULL, @edit_spec_detail_groupcode,1,getdate(),NULL,NULL,1),
                    ('096FF4DC-DFF9-439C-B909-3D28AC1E4921', @jibe_crew_role, NULL, @delete_spec_groupcode,1,getdate(),NULL,NULL,1)
                )
                AS SOURCE (RGR_UID,RGR_Role_ID,RGR_Right_Code,RGR_Group_Code,Created_By,Date_Of_Creation,Modified_By,Date_Of_Modification,Active_Status)
                ON TARGET.[RGR_UID] = SOURCE.[RGR_UID]
                WHEN MATCHED THEN
                UPDATE SET
                            TARGET.[RGR_Right_Code] = SOURCE.[RGR_Right_Code],
                            TARGET.[RGR_Group_Code] = SOURCE.[RGR_Group_Code],
                            TARGET.[Modified_By] = 1 ,
                            TARGET.[Date_Of_Modification] = getdate(),
                            TARGET.[Active_Status] = SOURCE.[Active_Status]

                WHEN NOT MATCHED BY TARGET THEN
                INSERT (RGR_UID,RGR_Role_ID,RGR_Right_Code,RGR_Group_Code,Created_By,Date_Of_Creation,Active_Status)
                VALUES (
                SOURCE.[RGR_UID],
                SOURCE.[RGR_Role_ID],
                SOURCE.[RGR_Right_Code],
                SOURCE.[RGR_Group_Code],
                SOURCE.[Created_By], SOURCE.[Date_Of_Creation],SOURCE.[Active_Status]);
            End
            `);

            await MigrationUtilsService.migrationLog(
                this.className,
                '',
                'S',
                'specification',
                'specification details access rights',
            );
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                this.className,
                errorLikeToString(error),
                'E',
                'specification',
                'specification details access rights',
                true,
            );
        }
    }
    public async down(queryRunner: QueryRunner): Promise<void> {}
}
