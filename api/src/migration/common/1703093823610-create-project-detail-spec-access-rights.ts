import { MigrationUtilsService, eApplicationLocation } from "j2utils";
import {MigrationInterface, QueryRunner} from "typeorm";

export class createProjectDetailSpecAccessRights1703093823610 implements MigrationInterface {

    moduleCode = 'project';
    moduleUid = '93A7855B-0445-4F29-978E-53D11DAFA767';

    functionCode = 'dry_dock';
    functionUid = 'F808DA39-BA82-482B-90D8-912ECB41BC04';

    viewTechSpec = {
        actionCode: 'view_tech_spec',
        rightCode: 'project_detail_view_tech_spec',
        rightDescription: 'View Tech Spec section in project dry dock',
        rightName: 'View Tech Spec in Project Dock',

        rightUid: '2d3dbcea-9f63-11ee-8c90-0242ac120002'
    }
    addTechSpecFromStandardJob = {
        actionCode: 'add_spec_from_standard_jobs',
        rightCode: 'project_detail_add_spec_from_standard_jobs',
        rightDescription: 'Add specification from standard jobs in project dry dock',
        rightName: 'Add Spec from Standard Jobs in Project Dry Dock',

        rightUid: 'f7fa62f9-f103-4d09-86bd-f1a68870d0fb'
    }
    addTechSpecFromAdHoc = {
        actionCode: 'add_spec_from_ad_hoc',
        rightCode: 'project_detail_add_spec_from_ad_hoc',
        rightDescription: 'Add ad hoc spec in project dry dock',
        rightName: 'Add Ad hoc Spec in Project Dry Dock',

        rightUid: 'fbf35619-2730-47fd-8ac5-c0490eedb174'
    }

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Rights
        await queryRunner.query(`
            MERGE INTO INF_LIB_Right AS TARGET
            USING (VALUES ('${this.viewTechSpec.rightUid}', '${this.viewTechSpec.rightCode}', '${this.viewTechSpec.rightDescription}', 1, '${this.moduleCode}', '${this.functionCode}', '${this.viewTechSpec.actionCode}', 1, getdate(), 1, getdate(), 1, '${this.viewTechSpec.rightName}', null),
                            ('${this.addTechSpecFromStandardJob.rightUid}', '${this.addTechSpecFromStandardJob.rightCode}', '${this.addTechSpecFromStandardJob.rightDescription}', 1, '${this.moduleCode}', '${this.functionCode}', '${this.addTechSpecFromStandardJob.actionCode}', 1, getdate(), 1, getdate(), 1, '${this.addTechSpecFromStandardJob.rightName}', null),
                            ('${this.addTechSpecFromAdHoc.rightUid}', '${this.addTechSpecFromAdHoc.rightCode}', '${this.addTechSpecFromAdHoc.rightDescription}', 1, '${this.moduleCode}', '${this.functionCode}', '${this.addTechSpecFromAdHoc.actionCode}', 1, getdate(), 1, getdate(), 1, '${this.addTechSpecFromAdHoc.rightName}', null))
                            AS SOURCE ([Right_UID], [Right_Code], [Right_Description], [Valid_On], [Module_Code],
                            [Function_Code], [Action], [Created_By], [Date_Of_Creation], [Modified_By], [Date_Of_Modification],
                            [Active_Status], [right_name], [api_url])

                AS SOURCE ([Right_UID], [Right_Code], [Right_Description], [Valid_On], [Module_Code],
                            [Function_Code], [Action], [Created_By], [Date_Of_Creation], [Modified_By], [Date_Of_Modification],
                            [Active_Status], [right_name], [api_url])
            ON TARGET.[Right_Code] = SOURCE.[Right_Code]
            WHEN MATCHED THEN
                UPDATE
                SET TARGET.[Right_UID]=SOURCE.[Right_UID],
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

        // link rights to user types
        await queryRunner.query(`
                MERGE INTO inf_lnk_right_user_type AS TARGET
                USING (VALUES ('21d6b4e4-4c04-439c-bc54-29958fb97709', '${this.viewTechSpec.rightCode}','3C084885-783B-46B8-9635-B2F70CC49218', 1, 1, getdate(), 1, NULL),
                                ('176fb4f9-4295-4789-a7c9-5e55ae5d5c05', '${this.viewTechSpec.rightCode}','0F3613B9-9FB5-40E6-8763-FC4941136598', 1, 1, getdate(), 1, NULL),
                                ('399cdbd8-9f68-11ee-8eab-325096b39f47, '${this.addTechSpecFromStandardJob.rightCode}',3C084885-783B-46B8-9635-B2F70CC49218', 1, 1, getdate(), 1, NULL),
                                ('fe528845-1e83-4373-843e-06e8f92b905d', '${this.addTechSpecFromStandardJob.rightCode}','0F3613B9-9FB5-40E6-8763-FC4941136598', 1, 1, getdate(), 1, NULL),('21d6b4e4-4c04-439c-bc54-29958fb97709, '${this.viewTechSpec.rightCode}',3C084885-783B-46B8-9635-B2F70CC49218', 1, 1, getdate(), 1, NULL),
                                ('9bbfd37d-d7fa-4a6a-aec7-d7c163c8f44b', '${this.addTechSpecFromAdHoc.rightCode}','3C084885-783B-46B8-9635-B2F70CC49218', 1, 1, getdate(), 1, NULL),
                                ('fa495b0e-5a19-42cd-ac72-30f54dcd7bd2', '${this.addTechSpecFromAdHoc.rightCode}','0F3613B9-9FB5-40E6-8763-FC4941136598', 1, 1, getdate(), 1, NULL),
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
        // link rights to roles
        await queryRunner.query(`
                if exists(select *
                    from INF_Lib_Roles
                    where Role = 'Client Admin'
                      and Active_Status = 1)
              Begin
                  Declare @AdminRoleId int
                  select @AdminRoleId = Role_ID from INF_Lib_Roles where Role = 'Client Admin' and Active_Status = 1
                  MERGE INTO INF_Lib_RoleGroupsRights AS TARGET
                  USING (VALUES (N'${this.viewTechSpec.rightUid}', @JibeImplementationRoleId, NULL, N'view_dry_dock_project_detail', 1, getdate(), NULL, NULL, 1),
                                (N'${this.viewTechSpec.rightUid}', @JibeImplementationRoleId, NULL, N'view_dry_dock_project_detail_onboard', 1, getdate(), NULL, NULL, 1),

                                (N'${this.addTechSpecFromAdHoc.rightUid}', @JibeImplementationRoleId, NULL, N'edit_dry_dock_porject_detail', 1, getdate(), NULL, NULL, 1),
                                (N'${this.addTechSpecFromAdHoc.rightUid}', @JibeImplementationRoleId, NULL, N'edit_dry_dock_porject_detail_onboard', 1, getdate(), NULL, NULL, 1),

                                (N'${this.addTechSpecFromStandardJob.rightUid}', @JibeImplementationRoleId, NULL, N'edit_dry_dock_porject_detail', 1, getdate(), NULL, NULL, 1),
                                (N'${this.addTechSpecFromStandardJob.rightUid}', @JibeImplementationRoleId, NULL, N'edit_dry_dock_porject_detail_onboard', 1, getdate(), NULL, NULL, 1),
                  )
                      AS SOURCE ([RGR_UID], [RGR_Role_ID], [RGR_Right_Code], [RGR_Group_Code], [Created_By], [Date_Of_Creation],
                                 [Modified_By],
                                 [Date_Of_Modification], [Active_Status])
                  ON TARGET.RGR_UID = SOURCE.RGR_UID
                  WHEN MATCHED THEN
                      UPDATE
                      SET TARGET.[RGR_UID]             = SOURCE.[RGR_UID],
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
                if exists(select *
                    from INF_Lib_Roles
                    where Role = 'JiBe Crew Implementation'
                      and Active_Status = 1)
              Begin
                  Declare @JibeImplementationRoleId int
                  select @JibeImplementationRoleId = Role_ID
                  from INF_Lib_Roles
                  where Role = 'JiBe Crew Implementation' and Active_Status = 1
                  MERGE INTO INF_Lib_RoleGroupsRights AS TARGET
                  USING (VALUES (N'${this.viewTechSpec.rightUid}', @JibeImplementationRoleId, NULL, N'view_dry_dock_project_detail', 1, getdate(), NULL, NULL, 1),
                                (N'${this.viewTechSpec.rightUid}', @JibeImplementationRoleId, NULL, N'view_dry_dock_project_detail_onboard', 1, getdate(), NULL, NULL, 1),

                                (N'${this.addTechSpecFromAdHoc.rightUid}', @JibeImplementationRoleId, NULL, N'edit_dry_dock_porject_detail', 1, getdate(), NULL, NULL, 1),
                                (N'${this.addTechSpecFromAdHoc.rightUid}', @JibeImplementationRoleId, NULL, N'edit_dry_dock_porject_detail_onboard', 1, getdate(), NULL, NULL, 1),

                                (N'${this.addTechSpecFromStandardJob.rightUid}', @JibeImplementationRoleId, NULL, N'edit_dry_dock_porject_detail', 1, getdate(), NULL, NULL, 1),
                                (N'${this.addTechSpecFromStandardJob.rightUid}', @JibeImplementationRoleId, NULL, N'edit_dry_dock_porject_detail_onboard', 1, getdate(), NULL, NULL, 1),
                  )
                      AS SOURCE ([RGR_UID], [RGR_Role_ID], [RGR_Right_Code], [RGR_Group_Code], [Created_By], [Date_Of_Creation],
                                 [Modified_By],
                                 [Date_Of_Modification], [Active_Status])
                  ON TARGET.RGR_UID = SOURCE.RGR_UID
                  WHEN MATCHED THEN
                      UPDATE
                      SET TARGET.[RGR_UID]             = SOURCE.[RGR_UID],
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

    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public async down(): Promise<void> {}

}


const app = new createProjectDetailSpecAccessRights1703093823610();

app.up({
    query: async (query: string) => {
        console.log(query);
        console.log('-------------------');
    }
} as any);