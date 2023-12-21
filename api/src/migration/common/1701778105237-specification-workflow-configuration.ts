import { MigrationUtilsService } from "j2utils";
import {MigrationInterface, QueryRunner} from "typeorm";

export class specificationWorkflowConfiguration1701778105237 implements MigrationInterface {
    public className = this.constructor.name;
    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.query(`
            MERGE INTO INF_Lib_Right AS TARGET USING (
            VALUES
                (N'637FAA24-A4B3-4574-AF8D-988947BFB89E', N'tm_specification_raise_office', N'Raise specification from office', N'o', '', '', N'raise', 1, GETDATE(), NULL, NULL, 1, N'Raise Specification from Office', NULL, 1),
                (N'4BD3577E-E6B4-41C5-A2AE-826C1F544547', N'tm_specification_raise_vessel', N'Raise specification from vessel', N'v', '', '', N'raise', 1, GETDATE(), NULL, NULL, 1, N'Raise Specification from Vessel', NULL, 1),
                (N'2A37A736-412F-485B-B2D6-721875E03725', N'tm_specification_in_progress_office', N'In Progress specification from office', N'o', '', '', N'in progress', 1, GETDATE(), NULL, NULL, 1, N'In Progress Specification from Office', NULL, 1),
                (N'0530025A-7298-40AC-99B8-8A98DF036D74', N'tm_specification_in_progress_vessel', N'In Progress specification from vessel', N'v', '', '', N'in progress', 1, GETDATE(), NULL, NULL, 1, N'In Progress Specification from Vessel', NULL, 1),
                (N'A9FFC73C-D9CD-44F8-8880-139C9E53BE63', N'tm_specification_complete_office', N'Complete specification from office', N'o', '', '', N'complete', 1, GETDATE(), NULL, NULL, 1, N'Complete Specification from Office', NULL, 1), 
                (N'29F9A525-1614-430D-8DFE-753B001B905C', N'tm_specification_complete_vessel', N'Complete specification from Vessel', N'v', '', '', N'complete', 1, GETDATE(), NULL, NULL, 1, N'Complete Specification from Vessel', NULL, 1),
                (N'971783B3-D465-47F8-B237-B184090F8948', N'tm_specification_verify_office', N'Verify specification from office', N'o', '', '', N'verify', 1, GETDATE(), NULL, NULL, 1, N'Verify Specification from Office', NULL, 1),
                (N'F737C36A-53AF-4C4A-9F68-9E21D7AA7BB2', N'tm_specification_verify_vessel', N'Verify specification from vessel', N'v', '', '', N'verify', 1, GETDATE(), NULL, NULL, 1, N'Verify Specification from Vessel', NULL, 1),
                (N'E23F217F-2FCC-4DB8-9EEC-DBFE359D9BEE', N'tm_specification_review_office', N'Review specification from office', N'o', '', '', N'review', 1, GETDATE(), NULL, NULL, 1, N'Review Specification from Office', NULL, 1), 
                (N'8A693DD2-1085-4369-B706-39897CB9E7EF', N'tm_specification_review_vessel', N'Review specification from vessel', N'v', '', '', N'review', 1, GETDATE(), NULL, NULL, 1, N'Review Specification from Vessel', NULL, 1),     
                (N'8A919420-A0AB-47C8-9E01-5491C2D8A20A', N'tm_specification_approve_office', N'Approve specification from office', N'o', '', '', N'approve', 1, GETDATE(), NULL, NULL, 1, N'Approve Specification from Office', NULL, 1),
                (N'B91B41BD-2F27-4A80-844C-17D105546D30', N'tm_specification_approve_vessel', N'Approve specification from vessel', N'v', '', '', N'approve', 1, GETDATE(), NULL, NULL, 1, N'Approve Specification from Vessel', NULL, 1),
                (N'A2E69DC3-F327-4358-80BC-7ACC8E711D73', N'tm_specification_close_office', N'Close specification from office', N'o', '', '', N'close', 1, GETDATE(), NULL, NULL, 1, N'Close Specification from Office', NULL, 1),
                (N'3CEC5834-BE50-449B-9E9D-D8DEDE2A1142', N'tm_specification_close_vessel', N'Close specification from vessel', N'v', '', '', N'close', 1, GETDATE(), NULL, NULL, 1, N'Close Specification from Vessel', NULL, 1),   
                (N'E482E45B-9308-4A84-97C3-A355FEC1CEFB', N'tm_specification_unclose_office', N'Unclose specification from office', N'o','', '', N'unclose', 1, GETDATE(), NULL, NULL, 1, N'Unclose Specification from Office', NULL, 1),
                (N'F38EE13A-AF58-427B-9540-6A7F0061AE81', N'tm_specification_unclose_vessel', N'Unclose specification from vessel', N'v', '', '', N'unclose', 1, GETDATE(), NULL, NULL, 1, N'Unclose Specification from Vessel', NULL, 1)
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
                (N'BFB38B27-674A-4B40-A617-8127D37063EC', N'tm_specification_unclose_vessel', N'0F3613B9-9FB5-40E6-8763-FC4941136598', 1, 1, getdate(), NULL, NULL)
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
            IF Exists(SELECT 1 FROM JMS_DTL_Workflow_config_details WHERE config_id in ( select Id from JMS_DTL_Workflow_config where active_status = 1 and JOB_Type = 'Specification'))
            BEGIN
               DECLARE @id int
               DECLARE workflow_config_Details CURSOR FOR
               select ID from JMS_DTL_Workflow_config_Details where config_id in (select id from JMS_DTL_Workflow_config where job_type = 'Specification' and active_status=1)
               OPEN workflow_config_Details
               FETCH NEXT FROM workflow_config_Details
               INTO @id
    
               WHILE @@FETCH_STATUS = 0
               BEGIN
               /* Deleting record */
               if @id is not null
               Delete from JMS_DTL_Workflow_config_Details
               WHERE ID=@id
    
               FETCH NEXT FROM workflow_config_Details
               INTO @id
               END
               CLOSE workflow_config_Details;
               DEALLOCATE workflow_config_Details;
            END
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
                            (@WorkList_MAX_ID, N'Specification', N'Technical Specification', 1, GETDATE(), 1, 0, NULL, 0, 0, 'SPEC')
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
            ----------------------------------------------Insert 'Specification' details in jms_dtl_workflow_config table--------------------------------------
                    BEGIN
                    DECLARE @MaxID int = 0,
                    @PkCondition varchar(100),
    
                    @JobType varchar(50) = 'Specification', --workflow set for which job type
                    @TotalDays int = 0 , -- total days until finalizing task
                    @VesselAssign int = 0, -- vessel assignment value
                    @SubTask int = 0,
                    @IncidentCategory int = 0 , 
                    @MSCATCategory int = 0, 
                    @Due_Date_Config varchar(600)='{"status":"CLOSE","days":"14","due_date":"Start Date"}',
                    @job_type_column_config varchar(1500) = '
                    {"status_config":[{"wfstatus":"Raise","mandatory":"Yes","rework":"No","delete":"Yes","save":"Yes"},
                    {"wfstatus":"In Progress","mandatory":"Yes","rework": null,"delete":"No","save":"Yes"},
                    {"wfstatus":"Complete","mandatory":"Yes","rework":"No","delete":"No","save":"Yes"},
                    {"wfstatus":"Verify","mandatory":"No","rework": null,"delete":"No","save":"Yes"},
                    {"wfstatus":"Review","mandatory":"No","rework": null,"delete":"No","save":"Yes"},
                    {"wfstatus":"Approve","mandatory":"Yes","rework":"Yes","delete":"No","save":"Yes"},
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
    
                -----------------------------------------Entry of 'Specification' in jms_dtl_workflow_config_details table--------------------
    
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
                    IF Not Exists(SELECT 1 FROM JMS_DTL_Workflow_config_details WHERE config_id in ( select Id from JMS_DTL_Workflow_config where active_status = 1 and JOB_Type = 'Specification'))
                    BEGIN
                        declare  @DefaultWfActions table (Workflow_OrderID INT, WorkflowType_ID VARCHAR(100), status_display_name VARCHAR(100), Workflow_Display VARCHAR(100), Active_Status int, Is_Rework int, Office_ID int, right_code varchar(1500))
                        INSERT INTO @DefaultWfActions (Workflow_OrderID, WorkflowType_ID, status_display_name, Workflow_Display, Active_Status, Is_Rework, Office_ID, right_code)
                        VALUES
                            (1, 'RAISE', 'Draft', 'Create New', 0, 0, null,'tm_specification_raise_office'),
                            (2, 'IN PROGRESS', 'Update Spec', 'Update Spec', 1, 0, 1,'tm_specification_in_progress_office'),
                            (3, 'COMPLETE', 'Complete Spec', 'Completed', 1, 0, 1,'tm_specification_complete_office'),
                            (4, 'VERIFY', NULL, NULL, 0, 0, 1,'tm_specification_verify_office'),
                            (5, 'REVIEW', NULL, NULL, 0, 0, 1,'tm_specification_review_office'),
                            (6, 'APPROVE', 'Approve', 'Approved', 1, 1, 1, 'tm_specification_approve_office'),
                            (7, 'CLOSE', 'Close', 'Closed', 1, 1, 1,'tm_specification_close_office'),
                            (8, 'UNCLOSE', 'Reopen', 'N/A', 1, 0, 1,'tm_specification_unclose_office')
                        declare  @DefaultAppLocations table (Is_Office INT)
                        INSERT INTO @DefaultAppLocations (Is_Office)
                        VALUES (1), (0)
                        DECLARE @WlType varchar (100) = null, @Config_Id int;
                        DECLARE wl_type_cursor CURSOR LOCAL FOR
                            select Id, JOB_Type from JMS_DTL_Workflow_config where active_status = 1 and JOB_Type = 'Specification'
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
                                                    SET @right_code='tm_specification_raise_office'
                                                    END
                                                    ELSE IF (@Is_Office =0)
                                                    BEGIN
                                                    Set @Active_Status = 0
                                                    SET @right_code='tm_specification_raise_vessel'
                                                    END
                                                        insert into JMS_DTL_Workflow_config_details ([ID], [Config_ID], [Workflow_Display], [status_display_name], [WorkflowType_ID], [Workflow_OrderID], [Is_Office], [Active_Status], [Display_name_pass], [Display_name_action], [is_rework], [Created_By], [Date_Of_Creation], [right_code], [Is_Postpone])
                                                            values (@Config_Details_Id, @Config_Id, @Workflow_Display, @status_display_name, @Default_WorkflowType_ID, @Default_Workflow_OrderID, @Is_Office, 1, @Workflow_Display, @Default_WorkflowType_ID, 0, 1, getDate(), @right_code, null)
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
            DECLARE @config_id int=(select ID from JMS_DTL_Workflow_config where JOB_Type='Specification' AND Active_Status=1)

            MERGE INTO JMS_DTL_Workflow_config_details AS TARGET USING (
            values
            (@config_id,'In Progress','{"validation":{"is_mandatory":false}}', null),
            (@config_id,'Complete','{"validation":{"is_mandatory":false}}', null),
            (@config_id,'Verify','{"validation":{"is_mandatory":true}}', null),
            (@config_id,'Review','{"validation":{"is_mandatory":true}}', null),
            (@config_id,'Approve','{"validation":{"is_mandatory":false}}', null),
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
            DECLARE @config_id int=(select ID from JMS_DTL_Workflow_config where JOB_Type='Specification' AND Active_Status=1)

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
                'specification workflow configuration',
            );

        } catch (error) {
            await MigrationUtilsService.migrationLog(
                this.className,
                JSON.stringify(error),
                'E',
                'dry_dock',
                'specification workflow configuration',
                true,
            );
        }
    }
    public async down(): Promise<void> {}
}
