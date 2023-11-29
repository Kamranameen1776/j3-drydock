import { MigrationUtilsService } from "j2utils";
import {MigrationInterface, QueryRunner} from "typeorm";

export class v3234222DryDockGeneralTabTasksAccessRights1701248232629 implements MigrationInterface {
    public className = this.constructor.name;
    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await MigrationUtilsService.createTableBackup('INF_Lib_Right');
            await MigrationUtilsService.createTableBackup('INF_lnk_right_user_type');
            await MigrationUtilsService.createTableBackup('inf_lib_grouprights');

            await queryRunner.query(`
            MERGE INTO INF_Lib_Right AS TARGET USING (
            VALUES
                (N'141B1F01-DC41-42D8-A9E5-F39F44D8F8E2', N'proj_drd_task_view', N'View task section in project dry dock', N'b', N'project', N'dry_dock', N'view', 1, GETDATE(), NULL, NULL, 1, N'View Task in Project Dry Dock', NULL, NULL), 
                (N'C7008D4B-A883-456E-9843-DA9A8D33054D', N'proj_drd_task_add', N'Add task access rights for project dry dock', N'b', N'project', N'dry_dock', N'add', 1, GETDATE(), NULL, NULL, 1, N'Add Task in Project Dry Dock', NULL, NULL),
                (N'A4661803-E008-43FB-943C-2CB6CBB60A87', N'proj_drd_task_edit', N'Edit task access rights for project dry dock', N'b', N'project', N'dry_dock', N'edit', 1, GETDATE(), NULL, NULL, 1, N'Edit Task in Project Dry Dock', NULL, NULL),
                (N'B8BF6904-A894-47A7-91B8-96D755A07ADF', N'proj_drd_task_delete', N'Delete task access rights for project dry dock', N'b', N'project', N'dry_dock', N'delete', 1, GETDATE(), NULL, NULL, 1, N'Delete Task in Project Dry Dock', NULL, NULL)
                )
            AS SOURCE ([Right_UID],[Right_Code],[Right_Description],[Valid_On],[Module_Code],[Function_Code],[Action],[Created_By],[Date_Of_Creation],[Modified_By],[Date_Of_Modification],[Active_Status],[right_name],[api_url],[is_work_flow])             
            
            ON TARGET.[Right_UID] = SOURCE.[Right_UID] 
        
            WHEN MATCHED THEN
                UPDATE SET TARGET.[Right_Code] = SOURCE.[Right_Code], TARGET.[Right_Description] = SOURCE.[Right_Description],TARGET.[Valid_On] = SOURCE.[Valid_On], TARGET.[Module_Code] = SOURCE.[Module_Code],TARGET.[Function_Code] = SOURCE.[Function_Code],TARGET.[Action] = SOURCE.[Action],
                TARGET.[Modified_By] = 1,TARGET.[Date_Of_Modification] = GETDATE(),TARGET.[Active_Status] = SOURCE.[Active_Status], TARGET.[right_name] = SOURCE.[right_name],
                TARGET.[api_url] = SOURCE.[api_url],TARGET.[is_work_flow] = SOURCE.[is_work_flow]
                
            WHEN NOT MATCHED BY TARGET THEN
                INSERT ([Right_UID],[Right_Code],[Right_Description],[Valid_On],[Module_Code],[Function_Code],[Action],[Created_By],[Date_Of_Creation],[Modified_By],[Date_Of_Modification],[Active_Status],[right_name],[api_url],[is_work_flow])
                VALUES (SOURCE.[Right_UID],SOURCE.[Right_Code],SOURCE.[Right_Description],SOURCE.[Valid_On],SOURCE.[Module_Code],SOURCE.[Function_Code],SOURCE.[Action], SOURCE.[Created_By], SOURCE.[Date_Of_Creation],SOURCE.[Modified_By],
                SOURCE.[Date_Of_Modification], SOURCE.[Active_Status],SOURCE.[right_name],SOURCE.[api_url],SOURCE.[is_work_flow]);
            `);

            await queryRunner.query(`
            MERGE INTO INF_lnk_right_user_type AS TARGET USING (
            VALUES
                (N'AF30C2E5-D3E0-46D4-B2B7-A8DA7B27DF80', N'proj_drd_task_view', N'3C084885-783B-46B8-9635-B2F70CC49218', 1, 1, getdate(), NULL, NULL),
                (N'509BCAE0-BA9B-4396-AA3A-C504236BF8A0', N'proj_drd_task_view', N'0F3613B9-9FB5-40E6-8763-FC4941136598', 1, 1, getdate(), NULL, NULL),
                (N'FD9DC4A1-7894-48B5-9E67-35330E70CD21', N'proj_drd_task_add', N'3C084885-783B-46B8-9635-B2F70CC49218', 1, 1, getdate(), NULL, NULL),
                (N'E475AB1D-BAC2-455E-AD1F-3EFEA32F12E8', N'proj_drd_task_add', N'0F3613B9-9FB5-40E6-8763-FC4941136598', 1, 1, getdate(), NULL, NULL),
                (N'9C7C1531-892F-4B34-8D76-DC4ADC78311A', N'proj_drd_task_edit', N'3C084885-783B-46B8-9635-B2F70CC49218', 1, 1, getdate(), NULL, NULL),
                (N'DB185F19-7A10-40B6-956C-D851D45C7AC4', N'proj_drd_task_edit', N'0F3613B9-9FB5-40E6-8763-FC4941136598', 1, 1, getdate(), NULL, NULL),
                (N'269844BE-FE14-4131-B712-45666100F458', N'proj_drd_task_delete', N'3C084885-783B-46B8-9635-B2F70CC49218', 1, 1, getdate(), NULL, NULL),
                (N'C00F9FA3-B063-40FF-AC62-7777CF5A2A1E', N'proj_drd_task_delete', N'0F3613B9-9FB5-40E6-8763-FC4941136598', 1, 1, getdate(), NULL, NULL)
                )
            AS SOURCE ( [uid], [right_code], [user_type_uid], [active_status],[created_by],[date_of_creation],[modified_by],[date_of_modification])
            
            ON TARGET.[uid] = SOURCE.[uid] 
            
            WHEN MATCHED THEN
                UPDATE SET TARGET.[right_code] = SOURCE.[right_code],TARGET.[user_type_uid] = SOURCE.[user_type_uid],
                TARGET.[active_status] = SOURCE.[active_status],TARGET.[modified_by] = 1,TARGET.[date_of_modification] = GETDATE()
            
            WHEN NOT MATCHED BY TARGET THEN
                INSERT ([uid], [right_code], [user_type_uid], [active_status],[created_by],[date_of_creation],[modified_by],[date_of_modification])
                VALUES (SOURCE.[uid], SOURCE.[right_code], SOURCE.[user_type_uid], SOURCE.[active_status], SOURCE.[created_by],
                SOURCE.[date_of_creation],SOURCE.[modified_by], SOURCE.[date_of_modification]);
            `);

            await queryRunner.query(`
            MERGE INTO inf_lib_grouprights AS TARGET USING (
            VALUES
                ( N'72C08493-C8AB-4474-A267-E9B430A93CE7', N'view_dry_dock_project_detail', N'proj_drd_task_view', 1, GETDATE(), NULL, NULL, 1 ),
                ( N'322D662A-E820-4CC3-8982-AC627A45C3A3', N'view_dry_dock_project_detail_onboard', N'proj_drd_task_view', 1, GETDATE(), NULL, NULL, 1 ),
                ( N'632BFCCA-2B3A-4C0B-8478-4292B1AE9AC9', N'edit_dry_dock_porject_detail', N'proj_drd_task_add', 1, GETDATE(), NULL, NULL, 1 ),
                ( N'4E4C3B86-98D3-4EDB-AAE0-C4F9C7086E1F', N'edit_dry_dock_porject_detail_onboard', N'proj_drd_task_add', 1, GETDATE(), NULL, NULL, 1 ),
                ( N'3BEE2D93-1B64-4CE6-B9E1-696E1D51414B', N'edit_dry_dock_porject_detail', N'proj_drd_task_edit', 1, GETDATE(), NULL, NULL, 1 ),
                ( N'94C9009A-3D7B-46BC-861E-BB44E8B50A9E', N'edit_dry_dock_porject_detail_onboard', N'proj_drd_task_edit', 1, GETDATE(), NULL, NULL, 1 ),
                ( N'06142EA0-B8F4-4394-92CE-122D4E39FB2F', N'edit_dry_dock_porject_detail', N'proj_drd_task_delete', 1, GETDATE(), NULL, NULL, 1 ),
                ( N'08384433-75D6-4898-BF3E-FBACB79E72D1', N'edit_dry_dock_porject_detail_onboard', N'proj_drd_task_delete', 1, GETDATE(), NULL, NULL, 1 )
                )    
            AS SOURCE ( [GR_UID], [GR_Group_Code], [GR_Right_Code], [Created_By], [Date_Of_Creation], [Modified_By], [Date_Of_Modification], [Active_Status] )
                
            ON TARGET.[GR_UID] = SOURCE.[GR_UID] 
                
            WHEN MATCHED THEN
                    UPDATE SET TARGET.[GR_Group_Code] = SOURCE.[GR_Group_Code], TARGET.[GR_Right_Code] = SOURCE.[GR_Right_Code],TARGET.[Modified_By] = 1 ,
                    TARGET.[Date_Of_Modification] = GETDATE(),TARGET.[Active_Status] = SOURCE.[Active_Status]
                
            WHEN NOT MATCHED BY TARGET THEN
                    INSERT ( [GR_UID], [GR_Group_Code], [GR_Right_Code], [Created_By], [Date_Of_Creation], [Active_Status] )
                    VALUES ( SOURCE.[GR_UID], SOURCE.[GR_Group_Code], SOURCE.[GR_Right_Code], SOURCE.[Created_By], SOURCE.[Date_Of_Creation], 
                    SOURCE.[Active_Status]);
            `);

            await MigrationUtilsService.migrationLog(
                this.className,
                '',
                'S',
                'dry_dock',
                'dry dock detail tasks access rights',
            );

        } catch (error) {
            await MigrationUtilsService.migrationLog(
                this.className,
                JSON.stringify(error),
                'E',
                'dry_dock',
                'dry dock detail tasks access rights',
                true,
            );
        }
    }

    public async down(): Promise<void> {
        try {
            await MigrationUtilsService.migrationLog(
                this.className,
                '',
                'S',
                'dry_dock',
                'dry dock detail tasks access rights',
            );
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                this.className,
                JSON.stringify(error),
                'E',
                'dry_dock',
                'dry dock detail tasks access rights',
                true,
            );
        }
    }
}
