import { MigrationUtilsService } from "j2utils";
import {MigrationInterface, QueryRunner} from "typeorm";

export class updatedSpecificationReworkWorkflow1705475545174 implements MigrationInterface {
    public className = this.constructor.name;
    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await MigrationUtilsService.createTableBackup('jms_dtl_workflow_config_details');

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
                    {"wfstatus":"In Progress","mandatory":"Yes","rework": "Yes","delete":"No","save":"Yes"},
                    {"wfstatus":"Complete","mandatory":"Yes","rework":"No","delete":"No","save":"Yes"},
                    {"wfstatus":"Close","mandatory":"Yes","rework":"Yes","delete":"No","save":"No"},
                    {"wfstatus":"Cancel","mandatory":"No","rework":"No","delete":"No","save":"No"}]}'
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
                            (1, 'RAISE', 'Draft', 'Create New', 1, 0, null,'tm_specification_raise_office'),
                            (2, 'IN PROGRESS', 'In Progress', 'In Progress', 1, 1, 1,'tm_specification_in_progress_office'),
                            (3, 'COMPLETE', 'Add to Plan', 'Planned', 1, 0, 1,'tm_specification_complete_office'),
                            (4, 'CLOSE', 'Close', 'Closed', 1, 1, 1,'tm_specification_close_office'),
                            (5, 'UNCLOSE', 'Cancel', 'Canceled', 1, 0, 1,'tm_specification_cancel_office')
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

            await MigrationUtilsService.migrationLog(
                this.className,
                '',
                'S',
                'specification',
                'Specification rework changes',
            );
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                this.className,
                JSON.stringify(error),
                'E',
                'specification',
                'Specification rework changes',
                true,
            );
        }
    }
    public async down(queryRunner: QueryRunner): Promise<void> {}
}

