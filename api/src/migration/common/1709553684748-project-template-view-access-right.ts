import { MigrationUtilsService } from "j2utils";
import {MigrationInterface, QueryRunner} from "typeorm";
import { errorLikeToString } from "../../common/drydock/ts-helpers/error-like-to-string";

export class projectTemplateViewAccessRight1709553684748 implements MigrationInterface {
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
                    ('E46A8FDE-233C-4700-A375-A099B77E977E', 'project_template_view_list', 'View Project Template in main grid', 'o', 'project','project_template_index', 'view', 1, getdate(), 1, NULL, 1, 'View Project Template Main Grid', 'dry-dock/project-templates-main')
                    )

            AS SOURCE ([Right_UID], [Right_Code], [Right_Description], [Valid_On], [Module_Code],
                           [Function_Code], [Action], [Created_By], [Date_Of_Creation], [Modified_By], [Date_Of_Modification],
                           [Active_Status], [right_name], [api_url])

            ON TARGET.[Right_UID] = SOURCE.[Right_UID]
            WHEN MATCHED THEN
                UPDATE
                SET
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
                ('FA5E9463-4D56-442A-8CA4-C6F3E5D91E80', 'project_template_view_list','3C084885-783B-46B8-9635-B2F70CC49218', 1, 1, getdate(), 1, NULL)
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
                ('859AB2FE-C77C-45FE-89F8-7B9F229A2C21', 'view_project_template_main','View access for Project Template', 1, getdate(), null, null, 1, 'View Project Template', '3C084885-783B-46B8-9635-B2F70CC49218')
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
                (N'1068196A-C7CF-4B10-A1FB-98F6CD58BF42', N'view_project_template_main', N'project_template_view_list', 1, 1, getdate(), NULL, NULL)
                )

            AS SOURCE ([GR_UID], [GR_Group_Code], [GR_Right_Code], [Active_Status], [created_by],
                           [date_of_creation], [modified_by], [date_of_modification])

            ON TARGET.GR_UID = SOURCE.GR_UID

            WHEN MATCHED THEN
                UPDATE
                SET
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
            IF EXISTS(select * from INF_Lib_Roles where Role = 'Client Admin' and Active_Status = 1)
            Begin
                Declare @AdminRoleId int
                select @AdminRoleId = Role_ID from INF_Lib_Roles where Role = 'Client Admin' and Active_Status = 1
                MERGE INTO INF_Lib_RoleGroupsRights AS TARGET
                USING (
				VALUES
					(N'5F5426A7-729E-4C13-A30A-BF4305160883', @AdminRoleId, NULL, N'view_project_template_main', 1, getdate(), NULL, NULL, 1)
				)
                    AS SOURCE ([RGR_UID], [RGR_Role_ID], [RGR_Right_Code], [RGR_Group_Code], [Created_By], [Date_Of_Creation],
                                [Modified_By],
                                [Date_Of_Modification], [Active_Status])
                ON TARGET.RGR_UID = SOURCE.RGR_UID
                WHEN MATCHED THEN
                    UPDATE
                    SET
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
            IF EXISTS(select * from INF_Lib_Roles where Role = 'JiBe Crew Implementation' and Active_Status = 1)
            Begin
                Declare @JibeImplementationRoleId int
                select @JibeImplementationRoleId = Role_ID
                from INF_Lib_Roles
                where Role = 'JiBe Crew Implementation' and Active_Status = 1
                MERGE INTO INF_Lib_RoleGroupsRights AS TARGET
                USING
				(VALUES
					(N'34ED7321-3D13-4E49-A902-0F908DCD1275', @JibeImplementationRoleId, NULL, N'view_project_template_main', 1, getdate(), NULL, NULL, 1))
                    AS SOURCE ([RGR_UID], [RGR_Role_ID], [RGR_Right_Code], [RGR_Group_Code], [Created_By], [Date_Of_Creation],
                                [Modified_By],
                                [Date_Of_Modification], [Active_Status])
                ON TARGET.RGR_UID = SOURCE.RGR_UID
                WHEN MATCHED THEN
                    UPDATE
                    SET
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

            await MigrationUtilsService.migrationLog(
                this.className,
                '',
                'S',
                'project_template',
                'project template view access right',
            );
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                this.className,
                errorLikeToString(error),
                'E',
                'project_template',
                'project template view access right',
                true,
            );
        }
    }
    public async down(queryRunner: QueryRunner): Promise<void> {}
}

