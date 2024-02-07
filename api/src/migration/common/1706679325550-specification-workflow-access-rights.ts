import { MigrationUtilsService } from "j2utils";
import {MigrationInterface, QueryRunner} from "typeorm";
import { errorLikeToString } from "../../common/drydock/ts-helpers/error-like-to-string";

export class specificationWorkflowAccessRights1706679325550 implements MigrationInterface {
    public className = this.constructor.name;
    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await MigrationUtilsService.createTableBackup('INF_Lib_Right');
            await MigrationUtilsService.createTableBackup('INF_lnk_right_user_type');

            await queryRunner.query(`
            MERGE INTO INF_Lib_Right AS TARGET USING (
            VALUES
                (N'637FAA24-A4B3-4574-AF8D-988947BFB89E', N'tm_specification_raise_office', N'Raise specification from office', N'o', 'project', 'specification_details', N'raise', 1, GETDATE(), NULL, NULL, 1, N'Raise Specification from Office', NULL, 1),
                (N'4BD3577E-E6B4-41C5-A2AE-826C1F544547', N'tm_specification_raise_vessel', N'Raise specification from vessel', N'v', 'project', 'specification_details', N'raise', 1, GETDATE(), NULL, NULL, 1, N'Raise Specification from Vessel', NULL, 1),
                (N'2A37A736-412F-485B-B2D6-721875E03725', N'tm_specification_in_progress_office', N'In Progress specification from office', N'o', 'project', 'specification_details', N'in progress', 1, GETDATE(), NULL, NULL, 1, N'In Progress Specification from Office', NULL, 1),
                (N'0530025A-7298-40AC-99B8-8A98DF036D74', N'tm_specification_in_progress_vessel', N'In Progress specification from vessel', N'v', 'project', 'specification_details', N'in progress', 1, GETDATE(), NULL, NULL, 1, N'In Progress Specification from Vessel', NULL, 1),
                (N'A9FFC73C-D9CD-44F8-8880-139C9E53BE63', N'tm_specification_complete_office', N'Complete specification from office', N'o', 'project', 'specification_details', N'complete', 1, GETDATE(), NULL, NULL, 1, N'Complete Specification from Office', NULL, 1),
                (N'29F9A525-1614-430D-8DFE-753B001B905C', N'tm_specification_complete_vessel', N'Complete specification from Vessel', N'v', 'project', 'specification_details', N'complete', 1, GETDATE(), NULL, NULL, 1, N'Complete Specification from Vessel', NULL, 1),
                (N'971783B3-D465-47F8-B237-B184090F8948', N'tm_specification_verify_office', N'Verify specification from office', N'o', 'project', 'specification_details', N'verify', 1, GETDATE(), NULL, NULL, 1, N'Verify Specification from Office', NULL, 1),
                (N'F737C36A-53AF-4C4A-9F68-9E21D7AA7BB2', N'tm_specification_verify_vessel', N'Verify specification from vessel', N'v', 'project', 'specification_details', N'verify', 1, GETDATE(), NULL, NULL, 1, N'Verify Specification from Vessel', NULL, 1),
                (N'E23F217F-2FCC-4DB8-9EEC-DBFE359D9BEE', N'tm_specification_review_office', N'Review specification from office', N'o', 'project', 'specification_details', N'review', 1, GETDATE(), NULL, NULL, 1, N'Review Specification from Office', NULL, 1),
                (N'8A693DD2-1085-4369-B706-39897CB9E7EF', N'tm_specification_review_vessel', N'Review specification from vessel', N'v', 'project', 'specification_details', N'review', 1, GETDATE(), NULL, NULL, 1, N'Review Specification from Vessel', NULL, 1),
                (N'8A919420-A0AB-47C8-9E01-5491C2D8A20A', N'tm_specification_approve_office', N'Approve specification from office', N'o', 'project', 'specification_details', N'approve', 1, GETDATE(), NULL, NULL, 1, N'Approve Specification from Office', NULL, 1),
                (N'B91B41BD-2F27-4A80-844C-17D105546D30', N'tm_specification_approve_vessel', N'Approve specification from vessel', N'v', 'project', 'specification_details', N'approve', 1, GETDATE(), NULL, NULL, 1, N'Approve Specification from Vessel', NULL, 1),
                (N'A2E69DC3-F327-4358-80BC-7ACC8E711D73', N'tm_specification_close_office', N'Close specification from office', N'o', 'project', 'specification_details', N'close', 1, GETDATE(), NULL, NULL, 1, N'Close Specification from Office', NULL, 1),
                (N'3CEC5834-BE50-449B-9E9D-D8DEDE2A1142', N'tm_specification_close_vessel', N'Close specification from vessel', N'v', 'project', 'specification_details', N'close', 1, GETDATE(), NULL, NULL, 1, N'Close Specification from Vessel', NULL, 1),
                (N'E482E45B-9308-4A84-97C3-A355FEC1CEFB', N'tm_specification_unclose_office', N'Unclose specification from office', N'o','project', 'specification_details', N'unclose', 1, GETDATE(), NULL, NULL, 1, N'Unclose Specification from Office', NULL, 1),
                (N'F38EE13A-AF58-427B-9540-6A7F0061AE81', N'tm_specification_unclose_vessel', N'Unclose specification from vessel', N'v', 'project', 'specification_details', N'unclose', 1, GETDATE(), NULL, NULL, 1, N'Unclose Specification from Vessel', NULL, 1),
                (N'59D75561-4778-4AF1-826D-2C32854A437F', N'tm_specification_cancel_office', N'Cancel dry dock from office', N'o', 'project', 'specification_details', N'cancel', 1, GETDATE(), NULL, NULL, 1, N'Cancel Dry Dock from Office', NULL, 1),
                (N'177C9392-EE1F-45AC-A6D9-ECD8805D7509', N'tm_specification_cancel_vessel', N'Cancel dry dock from vessel', N'v', 'project', 'specification_details', N'cancel', 1, GETDATE(), NULL, NULL, 1, N'Cancel Dry Dock from Vessel', NULL, 1)
                )

                AS SOURCE (Right_UID, Right_Code, Right_Description, Valid_On, Module_Code, Function_Code, Action, Created_By, Date_Of_Creation, Modified_By,
                Date_Of_Modification, Active_Status, right_name, api_url, is_work_flow)
                ON TARGET.Right_UID = SOURCE.Right_UID

                WHEN MATCHED THEN
                UPDATE SET
                TARGET.Right_Code = SOURCE.Right_Code, TARGET.Right_Description = SOURCE.Right_Description,
                TARGET.Valid_On = SOURCE.Valid_On, TARGET.Module_Code = SOURCE.Module_Code, TARGET.Function_Code = SOURCE.Function_Code, TARGET.Action = SOURCE.Action,
                TARGET.Created_By = SOURCE.Created_By, TARGET.Date_Of_Creation = SOURCE.Date_Of_Creation, TARGET.Modified_By = 1, TARGET.Date_Of_Modification = getDate(),
                TARGET.Active_Status = SOURCE.Active_Status, TARGET.right_name = SOURCE.right_name, TARGET.api_url = SOURCE.api_url, TARGET.is_work_flow = SOURCE.is_work_flow

                WHEN NOT MATCHED BY TARGET THEN
                INSERT (Right_UID, Right_Code, Right_Description, Valid_On, Module_Code, Function_Code, Action, Created_By, Date_Of_Creation, Modified_By, Date_Of_Modification, Active_Status, right_name, api_url, is_work_flow)
                VALUES (
                SOURCE.Right_UID, SOURCE.Right_Code, SOURCE.Right_Description, SOURCE.Valid_On, SOURCE.Module_Code, SOURCE.Function_Code, SOURCE.Action,
                SOURCE.Created_By, SOURCE.Date_Of_Creation, SOURCE.Modified_By, SOURCE.Date_Of_Modification, SOURCE.Active_Status, SOURCE.right_name,
                SOURCE.api_url, SOURCE.is_work_flow
                );
            `);

            await queryRunner.query(`
            MERGE INTO INF_lnk_right_user_type AS TARGET USING (
            VALUES
                (N'94E7F481-7A3B-47F1-9819-683B5F12A00B', N'tm_specification_raise_office', N'3C084885-783B-46B8-9635-B2F70CC49218', 1, 1, getdate(), NULL, NULL),
                (N'7F555FA8-6EE6-4DF3-9F58-A68B72B196A6', N'tm_specification_raise_vessel', N'0F3613B9-9FB5-40E6-8763-FC4941136598', 1, 1, getdate(), NULL, NULL),
                (N'89AB0A2A-6227-44B6-B06E-15816B16F529', N'tm_specification_in_progress_office', N'3C084885-783B-46B8-9635-B2F70CC49218', 1, 1, getdate(), NULL, NULL),
                (N'B316862A-CDAC-490B-9138-DF6176F6E699', N'tm_specification_in_progress_vessel', N'0F3613B9-9FB5-40E6-8763-FC4941136598', 1, 1, getdate(), NULL, NULL),
                (N'78C3D23D-9B99-470F-83EA-1E738868DA0A', N'tm_specification_complete_office', N'3C084885-783B-46B8-9635-B2F70CC49218', 1, 1, getdate(), NULL, NULL),
                (N'2F6BE26D-113D-4368-993D-8B739AF3CDF6', N'tm_specification_complete_vessel', N'0F3613B9-9FB5-40E6-8763-FC4941136598', 1, 1, getdate(), NULL, NULL),
                (N'57904CB9-B108-481D-9092-440D9A71F010', N'tm_specification_verify_office', N'3C084885-783B-46B8-9635-B2F70CC49218', 1, 1, getdate(), NULL, NULL),
                (N'D33AA301-D91F-4B21-B67D-BD551C4BB5E9', N'tm_specification_verify_vessel', N'0F3613B9-9FB5-40E6-8763-FC4941136598', 1, 1, getdate(), NULL, NULL),
                (N'9A322055-8A8D-4939-BFF5-0030D227242D', N'tm_specification_review_office', N'3C084885-783B-46B8-9635-B2F70CC49218', 1, 1, getdate(), NULL, NULL),
                (N'FF992B4B-F579-4694-9E7F-3ADA29F7EE86', N'tm_specification_review_vessel', N'0F3613B9-9FB5-40E6-8763-FC4941136598', 1, 1, getdate(), NULL, NULL),
                (N'B983C4CC-630C-4BEF-BED5-1CA03EF12C3C', N'tm_specification_approve_office', N'3C084885-783B-46B8-9635-B2F70CC49218', 1, 1, getdate(), NULL, NULL),
                (N'BAF2E8F1-260D-4ED6-8B04-24967E2F1502', N'tm_specification_approve_vessel', N'0F3613B9-9FB5-40E6-8763-FC4941136598', 1, 1, getdate(), NULL, NULL),
                (N'ED6E52FB-383A-4751-AD2A-224FFD3109D1', N'tm_specification_close_office', N'3C084885-783B-46B8-9635-B2F70CC49218', 1, 1, getdate(), NULL, NULL),
                (N'22807C18-B302-47F1-AB98-18A5E6489300', N'tm_specification_close_vessel', N'0F3613B9-9FB5-40E6-8763-FC4941136598', 1, 1, getdate(), NULL, NULL),
                (N'468C55D0-EABA-45EF-8171-7DB5B60374B8', N'tm_specification_unclose_office', N'3C084885-783B-46B8-9635-B2F70CC49218', 1, 1, getdate(), NULL, NULL),
                (N'BFB38B27-674A-4B40-A617-8127D37063EC', N'tm_specification_unclose_vessel', N'0F3613B9-9FB5-40E6-8763-FC4941136598', 1, 1, getdate(), NULL, NULL),
                (N'C43215D1-DF39-4D1C-87C4-B90478768A18', N'tm_specification_cancel_office', N'3C084885-783B-46B8-9635-B2F70CC49218', 1, 1, getdate(), NULL, NULL),
                (N'62ABB746-197D-45D6-B0F8-77000A3A7E20', N'tm_specification_cancel_vessel', N'0F3613B9-9FB5-40E6-8763-FC4941136598', 1, 1, getdate(), NULL, NULL)
                )

                AS SOURCE (uid, right_code, user_type_uid, active_status, created_by, date_of_creation, modified_by, date_of_modification)
                ON TARGET.uid = SOURCE.uid

                WHEN MATCHED THEN
                UPDATE SET TARGET.right_code = SOURCE.right_code,TARGET.user_type_uid = SOURCE.user_type_uid,
                TARGET.active_status = SOURCE.active_status, TARGET.created_by = SOURCE.created_by, TARGET.date_of_creation = SOURCE.date_of_creation,
                TARGET.modified_by = 1, TARGET.date_of_modification = GETDATE()

                WHEN NOT MATCHED BY TARGET THEN
                INSERT (uid, right_code, user_type_uid, active_status, created_by, date_of_creation, modified_by, date_of_modification)
                VALUES (
                SOURCE.uid, SOURCE.right_code, SOURCE.user_type_uid, SOURCE.active_status, SOURCE.created_by,
                SOURCE.date_of_creation, SOURCE.modified_by, SOURCE.date_of_modification
                );
            `);

            await MigrationUtilsService.migrationLog(
                this.className,
                '',
                'S',
                'specification',
                'specification workflow access rights',
            );
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                this.className,
                errorLikeToString(error),
                'E',
                'specification',
                'specification workflow access rights',
                true,
            );
        }
    }
    public async down(queryRunner: QueryRunner): Promise<void> {}
}

