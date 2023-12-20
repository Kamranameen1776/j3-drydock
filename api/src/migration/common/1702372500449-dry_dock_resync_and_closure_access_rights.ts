import { MigrationUtilsService } from "j2utils";
import {MigrationInterface, QueryRunner} from "typeorm";

export class dryDockResyncAndClosureAccessRights1702372500449 implements MigrationInterface {
    public className = this.constructor.name;
    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await MigrationUtilsService.createTableBackup('INF_Lib_Right');
            await MigrationUtilsService.createTableBackup('INF_lnk_right_user_type');
            await MigrationUtilsService.createTableBackup('inf_lib_grouprights');

            await queryRunner.query(` 
            MERGE INTO INF_Lib_Right AS TARGET USING (
            VALUES
                (N'CBD1B4EC-5DEE-4437-AE86-F367ED576EA0', N'dry_dock_project_delete', N'Delete dry dock project', N'o', N'project', N'project_index', N'delete', 1, GETDATE(), NULL, NULL, 1, N'Delete Dry Dock Project', NULL, NULL),
                (N'82111509-6B41-4DA6-8B81-1C52E2F599FA', N'dry_dock_project_resync', N'Re-Sync the record to other side in dry dock', N'b', N'project', N'dry_dock', N'resync', 1, GETDATE(), NULL, NULL, 1, N'Re-Sync Record for Dry Dock', NULL, NULL),
                (N'A609F4E7-3688-4376-B629-E3B4B9B24649', N'dry_dock_project_immediate_closure', N'To close the record immediately by skipping the intermediate statuses in dry dock', N'o', N'project', N'dry_dock', N'immediate_closure', 1, GETDATE(), NULL, NULL, 1, N'Immediate Closure for Dry Dock', NULL, NULL)
                )
            AS SOURCE ([Right_UID],[Right_Code],[Right_Description],[Valid_On],[Module_Code],[Function_Code],[Action],[Created_By],[Date_Of_Creation],[Modified_By],[Date_Of_Modification],[Active_Status],[right_name],[api_url],[is_work_flow])             
            ON TARGET.[Right_UID] = SOURCE.[Right_UID] 
            
            WHEN MATCHED THEN
                UPDATE SET TARGET.[Right_Code] = SOURCE.[Right_Code], TARGET.[Right_Description] = SOURCE.[Right_Description],TARGET.[Valid_On] = SOURCE.[Valid_On], TARGET.[Module_Code] = SOURCE.[Module_Code],TARGET.[Function_Code] = SOURCE.[Function_Code],TARGET.[Action] = SOURCE.[Action],
                TARGET.[Modified_By] = 1,TARGET.[Date_Of_Modification] = GETDATE(),TARGET.[Active_Status] = SOURCE.[Active_Status], TARGET.[right_name] = SOURCE.[right_name],
                TARGET.[api_url] = SOURCE.[api_url],TARGET.[is_work_flow] = SOURCE.[is_work_flow]
                    
            WHEN NOT MATCHED BY TARGET THEN
                INSERT ([Right_UID],[Right_Code],[Right_Description],[Valid_On],[Module_Code],[Function_Code],[Action],[Created_By],[Date_Of_Creation],[Modified_By],[Date_Of_Modification],[Active_Status],[right_name],[api_url],[is_work_flow])
                VALUES (SOURCE.[Right_UID],SOURCE.[Right_Code],SOURCE.[Right_Description],SOURCE.[Valid_On],SOURCE.[Module_Code],SOURCE.[Function_Code],
                SOURCE.[Action], SOURCE.[Created_By], SOURCE.[Date_Of_Creation],SOURCE.[Modified_By],SOURCE.[Date_Of_Modification], 
                SOURCE.[Active_Status],SOURCE.[right_name],SOURCE.[api_url],SOURCE.[is_work_flow]);
            `);

            await queryRunner.query(`
            MERGE INTO INF_lnk_right_user_type AS TARGET USING (
            VALUES
                (N'8F284781-193D-48D9-9B70-CE89BADA2EE6', N'dry_dock_project_resync', N'3C084885-783B-46B8-9635-B2F70CC49218', 1, 1, getdate(), NULL, NULL),
                (N'624BDF36-ED6E-4BB4-82A8-E427287A8015', N'dry_dock_project_resync', N'0F3613B9-9FB5-40E6-8763-FC4941136598', 1, 1, getdate(), NULL, NULL),
                (N'2640D021-2497-4354-8BCE-C7C7CD72A38D', N'dry_dock_project_immediate_closure', N'3C084885-783B-46B8-9635-B2F70CC49218', 1, 1, getdate(), NULL, NULL)
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
                ( N'50757BFB-50D3-44FD-8322-BECCA2A9774D', N'view_dry_dock_project_detail', N'dry_dock_project_resync', 1, GETDATE(), NULL, NULL, 1 ),
                ( N'7189D08A-180D-45D8-BF25-F600F4F67EF5', N'view_dry_dock_project_detail_onboard', N'dry_dock_project_resync', 1, GETDATE(), NULL, NULL, 1 ),
                ( N'453DE82A-8B39-490A-A0CF-042B6E31B7B5', N'view_dry_dock_project_detail', N'dry_dock_project_immediate_closure', 1, GETDATE(), NULL, NULL, 1 )
                )
                    
            AS SOURCE ( [GR_UID], [GR_Group_Code], [GR_Right_Code], [Created_By], [Date_Of_Creation], [Modified_By], [Date_Of_Modification], [Active_Status] )
                    
            ON TARGET.[GR_UID] = SOURCE.[GR_UID] 
                    
            WHEN MATCHED THEN
                    UPDATE SET TARGET.[GR_Group_Code] = SOURCE.[GR_Group_Code], TARGET.[GR_Right_Code] = SOURCE.[GR_Right_Code],TARGET.[Modified_By] = 1 ,
                    TARGET.[Date_Of_Modification] = GETDATE(),TARGET.[Active_Status] = SOURCE.[Active_Status]
                    
            WHEN NOT MATCHED BY TARGET THEN
                    INSERT ( [GR_UID], [GR_Group_Code], [GR_Right_Code], [Created_By], [Date_Of_Creation], [Active_Status] )
                    VALUES ( SOURCE.[GR_UID], SOURCE.[GR_Group_Code], SOURCE.[GR_Right_Code], SOURCE.[Created_By], SOURCE.[Date_Of_Creation], SOURCE.[Active_Status] );
            `);

            await MigrationUtilsService.migrationLog(
                this.className,
                '',
                'S',
                'dry_dock',
                'dry dock resync and closure access rights',
            );

        } catch (error) {
            await MigrationUtilsService.migrationLog(
                this.className,
                JSON.stringify(error),
                'E',
                'dry_dock',
                'dry dock resync and closure access rights',
                true,
            );
        }
    }
    public async down(): Promise<void> {}
}