import { MigrationInterface, QueryRunner } from 'typeorm';
import { MigrationUtilsService } from 'j2utils';

export class updatingModuleAndFunctionCodeOfDryDockAndSpecification1703064597417 implements MigrationInterface {
    public className = this.constructor.name;
    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await MigrationUtilsService.createTableBackup('INF_Lib_Right');

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
                (N'2D7D5387-D911-4VD07-9DF4-58C95F984506', N'tm_dry_dock_unclose_office', N'Unclose dry dock from office', N'o','project', 'dry_dock', N'unclose', 1, GETDATE(), NULL, NULL, 1, N'Unclose Dry Dock from Office', NULL, 1),
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
                (N'F38EE13A-AF58-427B-9540-6A7F0061AE81', N'tm_specification_unclose_vessel', N'Unclose specification from vessel', N'v', 'project', 'specification_details', N'unclose', 1, GETDATE(), NULL, NULL, 1, N'Unclose Specification from Vessel', NULL, 1)
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

            await MigrationUtilsService.migrationLog(
                this.className,
                '',
                'S',
                'dry_dock',
                'Update module and function',
            );
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                this.className,
                JSON.stringify(error),
                'E',
                'dry_dock',
                'Update module and function',
                true,
            );
        }
    }
    public async down(queryRunner: QueryRunner): Promise<void> {}
}
