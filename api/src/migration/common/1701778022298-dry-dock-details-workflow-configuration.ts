import { MigrationUtilsService } from "j2utils";
import {MigrationInterface, QueryRunner} from "typeorm";

export class dryDockDetailsWorkflowConfiguration1701778022298 implements MigrationInterface {
    public className = this.constructor.name;
    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await MigrationUtilsService.createTableBackup('INF_Lib_Right');
            await MigrationUtilsService.createTableBackup('INF_lnk_right_user_type');
            await MigrationUtilsService.createTableBackup('JMS_DTL_Workflow_config');
            await MigrationUtilsService.createTableBackup('jms_dtl_workflow_config_details');

            await queryRunner.query(`
            MERGE INTO INF_Lib_Right AS TARGET USING (
            VALUES
                (N'B7F302F6-71D2-444D-B6C4-1BBC7EC8A9B1', N'tm_dry_dock_raise_office', N'Raise dry dock from office', N'o', '', '', N'raise', 1, GETDATE(), NULL, NULL, 1, N'Raise Dry Dock from Office', NULL, 1),
                (N'A43B02C2-23F9-44DA-8593-CFDAD890DE99', N'tm_dry_dock_raise_vessel', N'Raise dry dock from vessel', N'v', '', '', N'raise', 1, GETDATE(), NULL, NULL, 1, N'Raise Dry Dock from Vessel', NULL, 1),
                (N'8B38FB2B-9B64-4250-8344-668E39061F69', N'tm_dry_dock_in_progress_office', N'In Progress dry dock from office', N'o', '', '', N'in progress', 1, GETDATE(), NULL, NULL, 1, N'In Progress Dry Dock from Office', NULL, 1),
                (N'3B6334B2-BE65-4622-92A4-5917A035C3E9', N'tm_dry_dock_in_progress_vessel', N'In Progress dry dock from vessel', N'v', '', '', N'in progress', 1, GETDATE(), NULL, NULL, 1, N'In Progress Dry Dock from Vessel', NULL, 1),
                (N'DA26F8A0-9DA1-4B9E-8857-C425D4CBCDF7', N'tm_dry_dock_complete_office', N'Complete dry dock from office', N'o', '', '', N'complete', 1, GETDATE(), NULL, NULL, 1, N'Complete Dry Dock from Office', NULL, 1), 
                (N'CD518A7B-D871-45DE-836D-B947024723BC', N'tm_dry_dock_complete_vessel', N'Complete dry dock from Vessel', N'v', '', '', N'complete', 1, GETDATE(), NULL, NULL, 1, N'Complete Dry Dock from Vessel', NULL, 1),
                (N'FF2CC4B4-1F5C-4692-B953-A07D7797CAE7', N'tm_dry_dock_verify_office', N'Verify dry dock from office', N'o', '', '', N'verify', 1, GETDATE(), NULL, NULL, 1, N'Verify Dry Dock from Office', NULL, 1),
                (N'981FAD0E-3F0F-4CC2-9D6D-E258FB5DB347', N'tm_dry_dock_verify_vessel', N'Verify dry dock from vessel', N'v', '', '', N'verify', 1, GETDATE(), NULL, NULL, 1, N'Verify Dry Dock from Vessel', NULL, 1),
                (N'2830B71C-C7EB-4E87-B540-B3A778BCACFF', N'tm_dry_dock_review_office', N'Review dry dock from office', N'o', '', '', N'review', 1, GETDATE(), NULL, NULL, 1, N'Review Dry Dock from Office', NULL, 1), 
                (N'29164F0C-20CB-41FB-B4D0-13387C69DA6E', N'tm_dry_dock_review_vessel', N'Review dry dock from vessel', N'v', '', '', N'review', 1, GETDATE(), NULL, NULL, 1, N'Review Dry Dock from Vessel', NULL, 1),     
                (N'896E4FCC-1415-4043-AB64-94AE91E49656', N'tm_dry_dock_approve_office', N'Approve dry dock from office', N'o', '', '', N'approve', 1, GETDATE(), NULL, NULL, 1, N'Approve Dry Dock from Office', NULL, 1),
                (N'72DE1339-48BC-4516-B7FA-1677AE0AF999', N'tm_dry_dock_approve_vessel', N'Approve dry dock from vessel', N'v', '', '', N'approve', 1, GETDATE(), NULL, NULL, 1, N'Approve Dry Dock from Vessel', NULL, 1),
                (N'E0E44628-5C17-4D1E-8F34-200A3C02A3F6', N'tm_dry_dock_close_office', N'Close dry dock from office', N'o', '', '', N'close', 1, GETDATE(), NULL, NULL, 1, N'Close Dry Dock from Office', NULL, 1),
                (N'21E9FFC2-481D-4D5F-B1FC-371ECE894D35', N'tm_dry_dock_close_vessel', N'Close dry dock from vessel', N'v', '', '', N'close', 1, GETDATE(), NULL, NULL, 1, N'Close Dry Dock from Vessel', NULL, 1),   
                (N'2D7D5387-D911-4D07-9DF4-58C95F984506', N'tm_dry_dock_unclose_office', N'Unclose dry dock from office', N'o','', '', N'unclose', 1, GETDATE(), NULL, NULL, 1, N'Unclose Dry Dock from Office', NULL, 1),
                (N'F994F5CE-0862-4B9B-B7E0-14904AA3D9ED', N'tm_dry_dock_unclose_vessel', N'Unclose dry dock from vessel', N'v', '', '', N'unclose', 1, GETDATE(), NULL, NULL, 1, N'Unclose Dry Dock from Vessel', NULL, 1)
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

            await queryRunner.query(`
            DECLARE @applocation nvarchar(20)
            SET @applocation = ( SELECT [value] FROM inf_lib_configuration WHERE [key] = 'location' )
            IF( @applocation = 'office')
            BEGIN
    
            BEGIN
            DECLARE @Wf_Pk_Condition varchar(100);
    
            -- To add job type entry in TEC_LIB_Worklist_Type
            BEGIN
                DECLARE @WorkList_MAX_ID INT
    
                SELECT @WorkList_MAX_ID = ((SELECT ISNULL(MAX(ID), 0) FROM TEC_LIB_Worklist_Type) + 1)
    
                MERGE INTO TEC_LIB_Worklist_Type AS TARGET USING (
                        VALUES
                            (@WorkList_MAX_ID, N'dry_dock', N'Dry Dock', 1, GETDATE(), 1, 0, NULL, 0, 0, 'DD')
                    )
                AS SOURCE ([ID],[Worklist_Type], [Worklist_Type_Display], [Created_By], [Date_Of_Creation], [Active_Status], [Is_Child_Task], [Is_SYNC], [Is_Inspection], [Is_Vetting], [job_card_prefix])
                ON TARGET.[Worklist_Type] = SOURCE.[Worklist_Type] AND TARGET.[active_status] = 1
                WHEN MATCHED THEN
                UPDATE SET
                        TARGET.[Worklist_Type_Display] = SOURCE.[Worklist_Type_Display],
                        TARGET.[active_status] = SOURCE.[active_status],
                        TARGET.[Is_Child_Task] = SOURCE.[Is_Child_Task],
                        TARGET.[Is_SYNC] = SOURCE.[Is_SYNC],
                        TARGET.[Is_Inspection] = SOURCE.[Is_Inspection],
                        TARGET.[Is_Vetting] = SOURCE.[Is_Vetting],
                        TARGET.[modified_by] = 1,
                        TARGET.[date_of_modification] = getdate(),
                        TARGET.[job_card_prefix] = SOURCE.[job_card_prefix]
                WHEN NOT MATCHED BY TARGET THEN
                INSERT ([ID],[Worklist_Type], [Worklist_Type_Display], [Created_By], [Date_Of_Creation],[Active_Status],
                        [Is_Child_Task], [Is_SYNC],[Is_Inspection], [Is_Vetting],[job_card_prefix])
                VALUES (ID,SOURCE.[Worklist_Type], SOURCE.[Worklist_Type_Display], SOURCE.[Created_By],
                        SOURCE.[Date_Of_Creation],SOURCE.[Active_Status], SOURCE.[Is_Child_Task], SOURCE.[Is_SYNC],SOURCE.[Is_Inspection],
                        SOURCE.[Is_Vetting], SOURCE.[job_card_prefix]);
    
                ------------- Sync script of TEC_LIB_Worklist_Type -------------
    
                    SET @Wf_Pk_Condition = 'ID='+CAST(@WorkList_MAX_ID AS VARCHAR(50))+''
    
                    EXEC SYNC_SP_DataSynch_MultiPK_DataLog 'TEC_LIB_Worklist_Type', @Wf_Pk_Condition, 0
    
                    SET @WorkList_MAX_ID = 0;
                    SET @Wf_Pk_Condition = null;
    
            END
            END
            ----------------------------------------------Insert 'Dry Dock' details in jms_dtl_workflow_config table--------------------------------------
                    BEGIN
                    DECLARE @MaxID int = 0,
                    @PkCondition varchar(100),
    
                    @JobType varchar(50) = 'dry_dock', --workflow set for which job type
                    @TotalDays int = 0 , -- total days until finalizing task
                    @VesselAssign int = 0, -- vessel assignment value
                    @SubTask int = 0,
                    @IncidentCategory int = 0 , 
                    @MSCATCategory int = 0, 
                    @Due_Date_Config varchar(600)='{"status":"CLOSE","days":"14","due_date":"Start Date"}',
                    @job_type_column_config varchar(1500) = '
                    {"status_config":[{"wfstatus":"Raise","mandatory":"Yes","rework":"No","delete":"Yes","save":"Yes"},
                    {"wfstatus":"In Progress","mandatory":"Yes","rework": "No","delete":"No","save":"Yes"},
                    {"wfstatus":"Complete","mandatory":"Yes","rework":"Yes","delete":"No","save":"Yes"},
                    {"wfstatus":"Verify","mandatory":"Yes","rework": null,"delete":"No","save":"Yes"},
                    {"wfstatus":"Review","mandatory":"No","rework": null,"delete":"No","save":"Yes"},
                    {"wfstatus":"Approve","mandatory":"No","rework":null,"delete":"No","save":"Yes"},
                    {"wfstatus":"Close","mandatory":"Yes","rework":"Yes","delete":"No","save":"No"},
                    {"wfstatus":"Unclose","mandatory":"No","rework":"No","delete":"No","save":"No"}]}'
                    SELECT @MaxID = ISNULL(MAX(ID),0)+1 FROM JMS_DTL_Workflow_config
                    IF(@MaxID > 0)
                    BEGIN
                        MERGE INTO JMS_DTL_Workflow_config AS TARGET USING (
                        VALUES
                        (@MaxID, @JobType, @TotalDays, @VesselAssign, @SubTask, @IncidentCategory, @MSCATCategory,@Due_Date_Config, @job_type_column_config)
                        )
                        AS SOURCE(ID, JOB_Type, Total_Days_Finalizing_Task, Vessel_Assigned, Sub_Task_Completed, is_incident_category, is_mscat_category,due_date_config, job_type_column_config)
                        ON TARGET.JOB_Type = SOURCE.JOB_Type AND TARGET.Active_Status = 1
                        WHEN MATCHED THEN
                        UPDATE SET
                        TARGET.JOB_Type = SOURCE.JOB_Type,
                        TARGET.Total_Days_Finalizing_Task = SOURCE.Total_Days_Finalizing_Task,
                        TARGET.Vessel_Assigned = SOURCE.Vessel_Assigned,
                        TARGET.Sub_Task_Completed = SOURCE.Sub_Task_Completed,
                        TARGET.is_incident_category = SOURCE.is_incident_category,
                        TARGET.is_mscat_category = SOURCE.is_mscat_category,
                        TARGET.due_date_config = SOURCE.due_date_config,
                        TARGET.job_type_column_config = SOURCE.job_type_column_config,
                        TARGET.Active_Status = 1,
                        TARGET.Modified_By = 1,
                        TARGET.Date_Of_Modification = getDate()
                        WHEN NOT MATCHED BY TARGET THEN
                        INSERT (ID,JOB_Type,Total_Days_Finalizing_Task,Vessel_Assigned,Sub_Task_Completed,is_incident_category,is_mscat_category,due_date_config,job_type_column_config, created_by,date_of_creation,active_status)
                        VALUES (
                        SOURCE.ID,
                        SOURCE.JOB_Type,
                        SOURCE.Total_Days_Finalizing_Task,
                        SOURCE.Vessel_Assigned,
                        SOURCE.Sub_Task_Completed,
                        SOURCE.is_incident_category,
                        SOURCE.is_mscat_category,
                        SOURCE.due_date_config,
                        SOURCE.job_type_column_config,
                        1,
                        getdate(),
                        1
                        );
                        SET @PkCondition = 'ID='+CAST(@MaxID AS VARCHAR(10))
                        EXEC SYNC_SP_DataSynch_MultiPK_DataLog 'JMS_DTL_Workflow_config' , @PkCondition, 0
                    END
                END
    
                -----------------------------------------Entry of 'Dry Dock' in jms_dtl_workflow_config_details table--------------------
    
                DECLARE @Wf_App_Location nvarchar(20),
                @Default_Workflow_OrderID int,
                @Default_WorkflowType_ID varchar(100),
                @Display_Name_Pass varchar(100),
                @Workflow_Display varchar(100),
                @status_display_name varchar (100),
                @Active_Status int,
                @Is_Rework int,
                @Is_Office int,
                @LogData varchar(max),
                @LogMessage varchar(max),
                @Config_Details_Id int,
                @right_code varchar(1500)
                BEGIN
                    SET @Wf_App_Location = ( SELECT [value] FROM inf_lib_configuration WHERE [key] = 'location' )
                    IF( @Wf_App_Location = 'office')
                    IF Not Exists(SELECT 1 FROM JMS_DTL_Workflow_config_details WHERE config_id in ( select Id from JMS_DTL_Workflow_config where active_status = 1 and JOB_Type = 'dry_dock'))
                    BEGIN
                        declare  @DefaultWfActions table (Workflow_OrderID INT, WorkflowType_ID VARCHAR(100), status_display_name VARCHAR(100), Workflow_Display VARCHAR(100), Active_Status int, Is_Rework int, Office_ID int, right_code varchar(1500))
                        INSERT INTO @DefaultWfActions (Workflow_OrderID, WorkflowType_ID, status_display_name, Workflow_Display, Active_Status, Is_Rework, Office_ID, right_code)
                        VALUES
                            (1, 'RAISE', 'Planned', 'Create New', 0, 0, null,'tm_dry_dock_raise_office'),
                            (2, 'IN PROGRESS', 'Yard Selection', 'Yard Selection', 1, 0, 1,'tm_dry_dock_in_progress_office'),
                            (3, 'COMPLETE', 'Execution', 'Execution', 1, 1, 1,'tm_dry_dock_complete_office'),
                            (4, 'VERIFY', 'Reporting', 'Reporting', 1, 0, 1,'tm_dry_dock_verify_office'),
                            (5, 'REVIEW', NULL, NULL, 0, 0, 1,'tm_dry_dock_review_office'),
                            (6, 'APPROVE', NULL, NULL, 0, 0, 1, 'tm_dry_dock_approve_office'),
                            (7, 'CLOSE', 'Close', 'Closed', 1, 1, 1,'tm_dry_dock_close_office'),
                            (8, 'UNCLOSE', 'Reopen', 'N/A', 1, 0, 1,'tm_dry_dock_unclose_office')
                        declare  @DefaultAppLocations table (Is_Office INT)
                        INSERT INTO @DefaultAppLocations (Is_Office)
                        VALUES (1), (0)
                        DECLARE @WlType varchar (100) = null, @Config_Id int;
                        DECLARE wl_type_cursor CURSOR LOCAL FOR
                            select Id, JOB_Type from JMS_DTL_Workflow_config where active_status = 1 and JOB_Type = 'dry_dock'
                        OPEN wl_type_cursor
                        FETCH NEXT FROM wl_type_cursor
                            INTO @Config_Id, @WlType
                        WHILE @@FETCH_STATUS = 0
                        BEGIN
                            DECLARE default_wf_actions_cursor CURSOR LOCAL FOR
                                SELECT Workflow_OrderID, WorkflowType_ID, status_display_name, Workflow_Display, Active_Status, Is_Rework, Office_ID, right_code FROM @DefaultWfActions order by Workflow_OrderID asc
                            OPEN default_wf_actions_cursor
                            FETCH NEXT FROM default_wf_actions_cursor
                                INTO @Default_Workflow_OrderID, @Default_WorkflowType_ID, @status_display_name, @Workflow_Display, @Active_Status, @Is_Rework, @Is_Office, @right_code
                            WHILE @@FETCH_STATUS = 0
                            BEGIN
                                IF @Default_WorkflowType_ID = 'Raise'
                                    BEGIN
                                        DECLARE app_location_cursor CURSOR LOCAL FOR
                                            SELECT Is_Office FROM @DefaultAppLocations order by Is_Office asc
                                        OPEN app_location_cursor
                                        FETCH NEXT FROM app_location_cursor
                                            INTO @Is_Office
                                        WHILE @@FETCH_STATUS = 0
                                        BEGIN
                                            BEGIN TRY
                                                set @Config_Details_Id = ((SELECT ISNULL(MAX(ID), 0) FROM JMS_DTL_Workflow_config_details) + 1);
                                                IF(@Config_Details_Id > 0)
                                                    BEGIN
                                                    IF (@Is_Office =1)
                                                    BEGIN
                                                    Set @Active_Status = 1
                                                    SET @right_code='tm_dry_dock_raise_office'
                                                    END
                                                    ELSE IF (@Is_Office =0)
                                                    BEGIN
                                                    Set @Active_Status = 0
                                                    SET @right_code='tm_dry_dock_raise_vessel'
                                                    END
                                                        insert into JMS_DTL_Workflow_config_details ([ID], [Config_ID], [Workflow_Display], [status_display_name], [WorkflowType_ID], [Workflow_OrderID], [Is_Office], [Active_Status], [Display_name_pass], [Display_name_action], [is_rework], [Created_By], [Date_Of_Creation], [right_code], [Is_Postpone])
                                                            values (@Config_Details_Id, @Config_Id, @Workflow_Display, @status_display_name, @Default_WorkflowType_ID, @Default_Workflow_OrderID, @Is_Office, @Active_Status, @Workflow_Display, @Default_WorkflowType_ID, 0, 1, getDate(), @right_code, null)
                                                        -- To Maintain log entries
                                                        set @LogData = ( CONCAT('ID=', ISNULL(CAST(@Config_Details_Id as varchar(100)), 'null'), '#Config_ID=', ISNULL(CAST(@Config_Id as varchar(100)), 'null'), '#Workflow_OrderID=', ISNULL(CAST(@Default_Workflow_OrderID as varchar(100)), 'null'),
                                                            '#WorkflowType_ID=', ISNULL(CAST(@Default_WorkflowType_ID as varchar(100)), 'null'), '#Active_Status=', ISNULL(CAST(1 as varchar(50)), 'null'), '#Created_By=', ISNULL(CAST(1 as varchar(50)), 'null'), '#Workflow_Display=', ISNULL(CAST(@Workflow_Display as varchar(100)), 'null'),
                                                            '#Date_Of_Creation=', ISNULL(CAST(getdate() as varchar(50)), 'null'), '#is_rework=', ISNULL(CAST(0 as varchar(100)), 'null') ));
                                                        SET @Wf_Pk_Condition = 'ID='+CAST(@Config_Details_Id AS VARCHAR(50))+''
                                                        EXEC SYNC_SP_DataSynch_MultiPK_DataLog 'JMS_DTL_Workflow_config_Details', @Wf_Pk_Condition, 0
                                                        EXEC [dbo].[inf_exception_log] @module_code = 'task_manager', @function_code = 'task_manager', @method = '[JMS_DTL_Workflow_config_details]', @log_level = 1,
                                                            @log_data = @LogData, @log_message = 'Record inserted successfully', @api = 'SQL', @user_id = 1, @location_id = 1
                                                    END
                                                set @LogData = null;
                                                set @Config_Details_Id = null;
                                            END TRY
                                            BEGIN CATCH
                                                set @LogData = ( CONCAT('Config_ID=', ISNULL(CAST(@Config_Id as varchar(100)), 'null'), '#WorkflowType_ID=', ISNULL(CAST(@Default_WorkflowType_ID as varchar(100)), 'null'), '#Is_Office=', ISNULL(CAST(@Is_Office as varchar(100)), 'null') ));
                                                set @LogMessage = (CONCAT('Error occurred while inserting record into JMS_DTL_Workflow_config_details table - ', ERROR_MESSAGE()));
                                                EXEC [dbo].[inf_exception_log] @module_code = 'task_manager', @function_code = 'task_manager', @method = '[JMS_DTL_Workflow_config_details]', @log_level = 1,
                                                @log_data = @LogData, @log_message = @LogMessage, @api = 'SQL', @user_id = 1, @location_id = 1
                                                set @LogData = null;
                                                set @LogMessage = null;
                                            END CATCH
                                            FETCH NEXT FROM app_location_cursor
                                            INTO @Is_Office
                                        END
                                        CLOSE app_location_cursor;
                                        DEALLOCATE app_location_cursor;
                                    END
                                ELSE
                                    BEGIN
                                        BEGIN TRY
                                            set @Config_Details_Id = ((SELECT ISNULL(MAX(ID), 0) FROM JMS_DTL_Workflow_config_details) + 1);
                                            IF(@Config_Details_Id > 0)
                                                BEGIN
                                                    insert into JMS_DTL_Workflow_config_details ([ID], [Config_ID], [Workflow_Display], [status_display_name], [WorkflowType_ID], [Workflow_OrderID], [Is_Office], [Active_Status], [Display_name_pass], [Display_name_action], [is_rework], [Created_By], [Date_Of_Creation], [right_code],[Is_Postpone])
                                                        values (@Config_Details_Id, @Config_Id, @Workflow_Display, @Workflow_Display, @Default_WorkflowType_ID, @Default_Workflow_OrderID, @Is_Office, @Active_Status, @Display_Name_Pass, @Default_WorkflowType_ID, @Is_Rework, 1, getDate(), @right_code,null)
                                                    -- To Maintain log entries
                                                    set @LogData = ( CONCAT('ID=', ISNULL(CAST(@Config_Details_Id as varchar(100)), 'null'), '#Config_ID=', ISNULL(CAST(@Config_Id as varchar(100)), 'null'), '#Workflow_OrderID=', ISNULL(CAST(@Default_Workflow_OrderID as varchar(100)), 'null'),
                                                        '#WorkflowType_ID=', ISNULL(CAST(@Default_WorkflowType_ID as varchar(100)), 'null'), '#Active_Status=', ISNULL(CAST(@Active_Status as varchar(50)), 'null'), '#Created_By=', ISNULL(CAST(1 as varchar(50)), 'null'),  '#Workflow_Display=', ISNULL(CAST(@Workflow_Display as varchar(100)), 'null'),
                                                        '#Date_Of_Creation=', ISNULL(CAST(getdate() as varchar(50)), 'null'), '#is_rework=', ISNULL(CAST(@Is_Rework as varchar(100)), 'null') ));
                                                    SET @Wf_Pk_Condition = 'ID='+CAST(@Config_Details_Id AS VARCHAR(50))+''
                                                    EXEC SYNC_SP_DataSynch_MultiPK_DataLog 'JMS_DTL_Workflow_config_Details', @Wf_Pk_Condition, 0
                                                    EXEC [dbo].[inf_exception_log] @module_code = 'task_manager', @function_code = 'task_manager', @method = '[JMS_DTL_Workflow_config_details]', @log_level = 1,
                                                        @log_data = @LogData, @log_message = 'Record inserted successfully', @api = 'SQL', @user_id = 1, @location_id = 1
                                                END
                                            set @LogData = null;
                                            set @Config_Details_Id = null;
                                        END TRY
                                        BEGIN CATCH
                                            set @LogData = ( CONCAT('Config_ID=', ISNULL(CAST(@Config_Id as varchar(100)), 'null'), '#WorkflowType_ID=', ISNULL(CAST(@Default_WorkflowType_ID as varchar(100)), 'null') ));
                                            set @LogMessage = (CONCAT('Error occurred while inserting record into JMS_DTL_Workflow_config_details table - ', ERROR_MESSAGE()));
                                            EXEC [dbo].[inf_exception_log] @module_code = 'task_manager', @function_code = 'task_manager', @method = '[JMS_DTL_Workflow_config_details]', @log_level = 1,
                                            @log_data = @LogData, @log_message = @LogMessage, @api = 'SQL', @user_id = 1, @location_id = 1
                                            set @LogData = null;
                                            set @LogMessage = null;
                                        END CATCH
                                    END
                                FETCH NEXT FROM default_wf_actions_cursor
                                    INTO @Default_Workflow_OrderID, @Default_WorkflowType_ID, @Display_Name_Pass, @Workflow_Display, @Active_Status, @Is_Rework, @Is_Office, @right_code
                            END
                            CLOSE default_wf_actions_cursor;
                            DEALLOCATE default_wf_actions_cursor;
                            FETCH NEXT FROM wl_type_cursor
                                INTO @Config_Id, @WlType
                        END
                        CLOSE wl_type_cursor;
                        DEALLOCATE wl_type_cursor;
                    END
                END
            END
            `);

            await queryRunner.query(`
            DECLARE @config_id int=(select ID from JMS_DTL_Workflow_config where JOB_Type='dry_dock' AND Active_Status=1)

            MERGE INTO JMS_DTL_Workflow_config_details AS TARGET USING (
            values
            (@config_id,'In Progress','{"validation":{"is_mandatory":false}}', null),
            (@config_id,'Complete','{"validation":{"is_mandatory":false}}', null),
            (@config_id,'Verify','{"validation":{"is_mandatory":false}}', null),
            (@config_id,'Review','{"validation":{"is_mandatory":true}}', null),
            (@config_id,'Approve','{"validation":{"is_mandatory":true}}', null),
            (@config_id,'Close','{"validation":{"is_mandatory":false}}', null),
            (@config_id,'Unclose','{"validation":{"is_mandatory":true}}', null)  
            )
            AS SOURCE(Config_ID,WorkflowType_ID, config_details, internal_config)
            ON TARGET.Config_ID = SOURCE.Config_ID and TARGET.WorkflowType_ID = SOURCE.WorkflowType_ID

            WHEN MATCHED THEN
            UPDATE SET
            TARGET.internal_config= SOURCE.internal_config,
            TARGET.config_details= SOURCE.config_details;
            `);

            await queryRunner.query(`
            DECLARE @config_id int=(select ID from JMS_DTL_Workflow_config where JOB_Type='dry_dock' AND Active_Status=1)

            DECLARE @Id int=null
            DECLARE workflow_config CURSOR for
            select ID from JMS_DTL_Workflow_config_details where config_ID=@config_id

            OPEN workflow_config
            FETCH NEXT FROM workflow_config into @Id

            WHILE (@@FETCH_STATUS=0)
            BEGIN
                EXEC SYNC_SP_DataSynchronizer_DataLog 'jms_dtl_workflow_config_details', 'ID', @Id, 0
                FETCH NEXT FROM workflow_config into @Id
            END

            CLOSE workflow_config;
            DEALLOCATE workflow_config;
            `);

            await MigrationUtilsService.migrationLog(
                this.className,
                '',
                'S',
                'dry_dock',
                'dry dock detail workflow configuration',
            );

        } catch (error) {
            await MigrationUtilsService.migrationLog(
                this.className,
                JSON.stringify(error),
                'E',
                'dry_dock',
                'dry dock detail workflow configuration',
                true,
            );
        }
    }
    public async down(): Promise<void> {}
}
