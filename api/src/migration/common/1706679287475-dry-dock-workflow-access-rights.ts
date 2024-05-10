import { MigrationUtilsService } from "j2utils";
import { MigrationInterface, QueryRunner} from "typeorm";
import { errorLikeToString } from "../../common/drydock/ts-helpers/error-like-to-string";

export class dryDockWorkflowAccessRights1706679287475 implements MigrationInterface {
    public className = this.constructor.name;
    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await MigrationUtilsService.createTableBackup('INF_Lib_Right');
            await MigrationUtilsService.createTableBackup('INF_lnk_right_user_type');

            await queryRunner.query(`
            MERGE INTO INF_Lib_Right AS TARGET USING (
            VALUES
                (N'B7F302F6-71D2-444D-B6C4-1BBC7EC8A9B1', N'tm_dry_dock_raise_office', N'Raise dry dock from office', N'o', 'project', 'dry_dock', N'raise', 1, GETDATE(), NULL, NULL, 1, N'Raise Dry Dock from Office', NULL, 1),
                (N'A43B02C2-23F9-44DA-8593-CFDAD890DE99', N'tm_dry_dock_raise_vessel', N'Raise dry dock from vessel', N'v', 'project', 'dry_dock', N'raise', 1, GETDATE(), NULL, NULL, 1, N'Raise Dry Dock from Vessel', NULL, 1),
                (N'8B38FB2B-9B64-4250-8344-668E39061F69', N'tm_dry_dock_in_progress_office', N'In Progress dry dock from office', N'o', 'project', 'dry_dock', N'in progress', 1, GETDATE(), NULL, NULL, 1, N'In Progress Dry Dock from Office', NULL, 1),
                (N'3B6334B2-BE65-4622-92A4-5917A035C3E9', N'tm_dry_dock_in_progress_vessel', N'In Progress dry dock from vessel', N'v', 'project', 'dry_dock', N'in progress', 1, GETDATE(), NULL, NULL, 1, N'In Progress Dry Dock from Vessel', NULL, 1),
                (N'DA26F8A0-9DA1-4B9E-8857-C425D4CBCDF7', N'tm_dry_dock_complete_office', N'Complete dry dock from office', N'o', 'project', 'dry_dock', N'complete', 1, GETDATE(), NULL, NULL, 1, N'Complete Dry Dock from Office', NULL, 1),
                (N'CD518A7B-D871-45DE-836D-B947024723BC', N'tm_dry_dock_complete_vessel', N'Complete dry dock from Vessel', N'v', 'project', 'dry_dock', N'complete', 1, GETDATE(), NULL, NULL, 1, N'Complete Dry Dock from Vessel', NULL, 1),
                (N'FF2CC4B4-1F5C-4692-B953-A07D7797CAE7', N'tm_dry_dock_verify_office', N'Verify dry dock from office', N'o', 'project', 'dry_dock', N'verify', 1, GETDATE(), NULL, NULL, 1, N'Verify Dry Dock from Office', NULL, 1),
                (N'981FAD0E-3F0F-4CC2-9D6D-E258FB5DB347', N'tm_dry_dock_verify_vessel', N'Verify dry dock from vessel', N'v', 'project', 'dry_dock', N'verify', 1, GETDATE(), NULL, NULL, 1, N'Verify Dry Dock from Vessel', NULL, 1),
                (N'2830B71C-C7EB-4E87-B540-B3A778BCACFF', N'tm_dry_dock_review_office', N'Review dry dock from office', N'o', 'project', 'dry_dock', N'review', 1, GETDATE(), NULL, NULL, 1, N'Review Dry Dock from Office', NULL, 1),
                (N'29164F0C-20CB-41FB-B4D0-13387C69DA6E', N'tm_dry_dock_review_vessel', N'Review dry dock from vessel', N'v', 'project', 'dry_dock', N'review', 1, GETDATE(), NULL, NULL, 1, N'Review Dry Dock from Vessel', NULL, 1),
                (N'896E4FCC-1415-4043-AB64-94AE91E49656', N'tm_dry_dock_approve_office', N'Approve dry dock from office', N'o', 'project', 'dry_dock', N'approve', 1, GETDATE(), NULL, NULL, 1, N'Approve Dry Dock from Office', NULL, 1),
                (N'72DE1339-48BC-4516-B7FA-1677AE0AF999', N'tm_dry_dock_approve_vessel', N'Approve dry dock from vessel', N'v', 'project', 'dry_dock', N'approve', 1, GETDATE(), NULL, NULL, 1, N'Approve Dry Dock from Vessel', NULL, 1),
                (N'E0E44628-5C17-4D1E-8F34-200A3C02A3F6', N'tm_dry_dock_close_office', N'Close dry dock from office', N'o', 'project', 'dry_dock', N'close', 1, GETDATE(), NULL, NULL, 1, N'Close Dry Dock from Office', NULL, 1),
                (N'21E9FFC2-481D-4D5F-B1FC-371ECE894D35', N'tm_dry_dock_close_vessel', N'Close dry dock from vessel', N'v', 'project', 'dry_dock', N'close', 1, GETDATE(), NULL, NULL, 1, N'Close Dry Dock from Vessel', NULL, 1),
                (N'2D7D5387-D911-4D07-9DF4-58C95F984506', N'tm_dry_dock_unclose_office', N'Unclose dry dock from office', N'o','project', 'dry_dock', N'unclose', 1, GETDATE(), NULL, NULL, 1, N'Unclose Dry Dock from Office', NULL, 1),
                (N'F994F5CE-0862-4B9B-B7E0-14904AA3D9ED', N'tm_dry_dock_unclose_vessel', N'Unclose dry dock from vessel', N'v', 'project', 'dry_dock', N'unclose', 1, GETDATE(), NULL, NULL, 1, N'Unclose Dry Dock from Vessel', NULL, 1)
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
                (N'75169482-05CE-46D2-B0E0-198481441F01', N'tm_dry_dock_raise_office', N'3C084885-783B-46B8-9635-B2F70CC49218', 1, 1, getdate(), NULL, NULL),
                (N'E5E81596-BECF-402C-87E7-3D9BFA41FC29', N'tm_dry_dock_raise_vessel', N'0F3613B9-9FB5-40E6-8763-FC4941136598', 1, 1, getdate(), NULL, NULL),
                (N'2BF8582B-F85F-47E4-8509-A665F2C5A4AE', N'tm_dry_dock_in_progress_office', N'3C084885-783B-46B8-9635-B2F70CC49218', 1, 1, getdate(), NULL, NULL),
                (N'36559F2A-2345-4957-BD05-634105B858C9', N'tm_dry_dock_in_progress_vessel', N'0F3613B9-9FB5-40E6-8763-FC4941136598', 1, 1, getdate(), NULL, NULL),
                (N'69176211-9DB9-428B-ABB1-34728AB183D3', N'tm_dry_dock_complete_office', N'3C084885-783B-46B8-9635-B2F70CC49218', 1, 1, getdate(), NULL, NULL),
                (N'525165D2-B82A-405A-802E-914CBEE7E596', N'tm_dry_dock_complete_vessel', N'0F3613B9-9FB5-40E6-8763-FC4941136598', 1, 1, getdate(), NULL, NULL),
                (N'58086E1D-F5D5-4879-972A-E68378030040', N'tm_dry_dock_verify_office', N'3C084885-783B-46B8-9635-B2F70CC49218', 1, 1, getdate(), NULL, NULL),
                (N'07F39853-95D4-4000-8D49-651F4A7A0A3B', N'tm_dry_dock_verify_vessel', N'0F3613B9-9FB5-40E6-8763-FC4941136598', 1, 1, getdate(), NULL, NULL),
                (N'B4120F22-4AD0-4DC0-B152-206C698F0273', N'tm_dry_dock_review_office', N'3C084885-783B-46B8-9635-B2F70CC49218', 1, 1, getdate(), NULL, NULL),
                (N'91761BB7-32BE-4E7A-ACAF-AAD00FFD1F02', N'tm_dry_dock_review_vessel', N'0F3613B9-9FB5-40E6-8763-FC4941136598', 1, 1, getdate(), NULL, NULL),
                (N'17425E42-8E2E-4D2A-B7E3-FBB0A14A5167', N'tm_dry_dock_approve_office', N'3C084885-783B-46B8-9635-B2F70CC49218', 1, 1, getdate(), NULL, NULL),
                (N'0D5D5EF5-8B34-4580-8436-8D952E503C31', N'tm_dry_dock_approve_vessel', N'0F3613B9-9FB5-40E6-8763-FC4941136598', 1, 1, getdate(), NULL, NULL),
                (N'BA9583CA-C6CB-4AAC-93A3-E1131AB38C74', N'tm_dry_dock_close_office', N'3C084885-783B-46B8-9635-B2F70CC49218', 1, 1, getdate(), NULL, NULL),
                (N'B778B332-B301-4436-9042-CB946C503A76', N'tm_dry_dock_close_vessel', N'0F3613B9-9FB5-40E6-8763-FC4941136598', 1, 1, getdate(), NULL, NULL),
                (N'F4EF11FC-0D9A-41E5-BDDA-DBCC8C5FCC24', N'tm_dry_dock_unclose_office', N'3C084885-783B-46B8-9635-B2F70CC49218', 1, 1, getdate(), NULL, NULL),
                (N'6614A8DB-ABA7-4D6D-8A0F-0E2BE1053D92', N'tm_dry_dock_unclose_vessel', N'0F3613B9-9FB5-40E6-8763-FC4941136598', 1, 1, getdate(), NULL, NULL)
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
                'dry_dock',
                'dry dock workflow access rights',
            );
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                this.className,
                errorLikeToString(error),
                'E',
                'dry_dock',
                'dry dock workflow access rights',
                true,
            );
        }
    }
    public async down(queryRunner: QueryRunner): Promise<void> {}
}
