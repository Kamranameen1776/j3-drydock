import { MigrationUtilsService } from "j2utils";
import { MigrationInterface, QueryRunner } from "typeorm";

/** @private */
const enum Location {
    Office = 'o',
    Vessel = 'v',
}

/** @private */
const enum Action {
    View = 'view',
    Edit = 'edit',
}

/** @private */
interface AccessRightRecordInput {
    readonly uid: string;
    readonly code: string;
    readonly name: string;
    readonly description: string;
    readonly action: Action;
    readonly validOn: Location;
}

/** @private */
const accessRights: AccessRightRecordInput[] = [
    {
        uid: '542D4F69-361B-4611-9EB8-675B5078A58D',
        code: 'view_specification_detail',
        name: 'View Specification Detail',
        description: 'View specification detail page',
        action: Action.View,
        validOn: Location.Office,
    },
    {
        uid: 'E23AB67E-6A5D-4CFA-BF7B-CE1D9A879AF8',
        code: 'view_general_information_section',
        name: 'View General Information in Specification',
        description: 'View General Information Section in Specification',
        action: Action.View,
        validOn: Location.Office,
    },
    {
        uid: 'D1019F3E-4931-4906-8372-71189903D495',
        code: 'view_requisition_section',
        name: 'View Requisition in Specification',
        description: 'View Requisition Section in Specification',
        action: Action.View,
        validOn: Location.Office,
    },
    {
        uid: '0B404328-13A0-4312-A8A1-982544A4DBBE',
        code: 'view_sub_items_section',
        name: 'View Sub Items in Specification',
        description: 'View Sub Items Section in Specification',
        action: Action.View,
        validOn: Location.Office,
    },
    {
        uid: '8EC05117-9F98-44F8-9C27-5F42AB0EF41F',
        code: 'view_findings_section',
        name: 'View Findings in Specification',
        description: 'View Findings Section in Specification',
        action: Action.View,
        validOn: Location.Office,
    },
    {
        uid: '9746E187-6931-4C7B-B154-50A8BAE422EE',
        code: 'view_pms_jobs_tab',
        name: 'View PMS Jobs in Specification',
        description: 'View PMS Jobs tab in Specification',
        action: Action.View,
        validOn: Location.Office,
    },
    {
        uid: '3A6AF4D8-7E51-414F-91F8-37CEAFC7BA25',
        code: 'view_attachments_section',
        name: 'View Attachments in Specification',
        description: 'View attachments rights for project dry dock',
        action: Action.View,
        validOn: Location.Office,
    },
    {
        uid: '248E5ED1-7989-410B-AE2F-18CFC9C91096',
        code: 'view_specification_detail_onboard',
        name: 'View Specification Detail',
        description: 'View specification detail page',
        action: Action.View,
        validOn: Location.Vessel,
    },
    {
        uid: '177DA4F5-AB2C-49B7-9018-9442EB395C38',
        code: 'view_general_information_section_onboard',
        name: 'View General Information in Specification',
        description: 'View General Information Section in Specification',
        action: Action.View,
        validOn: Location.Vessel,
    },
    {
        uid: '17724742-CB7E-42DA-A363-12D8C81E8F1E',
        code: 'view_requisition_section_onboard',
        name: 'View Requisition in Specification',
        description: 'View Requisition Section in Specification',
        action: Action.View,
        validOn: Location.Vessel,
    },
    {
        uid: 'B984E047-8679-4864-94E2-7CC6A1D259FB',
        code: 'view_sub_items_section_onboard',
        name: 'View Sub Items in Specification',
        description: 'View Sub Items Section in Specification',
        action: Action.View,
        validOn: Location.Vessel,
    },
    {
        uid: '8A9C0668-C196-4388-B7D5-0CC1726044C5',
        code: 'view_findings_section_onboard',
        name: 'View Findings in Specification',
        description: 'View Findings Section in Specification',
        action: Action.View,
        validOn: Location.Vessel,
    },
    {
        uid: 'B8E35313-00D5-4188-84F4-B29406E64E60',
        code: 'view_pms_jobs_tab_onboard',
        name: 'View PMS Jobs in Specification',
        description: 'View PMS Jobs tab in Specification',
        action: Action.View,
        validOn: Location.Vessel,
    },
    {
        uid: 'C9510BB1-8391-4268-BE9A-283E9DCAABA4',
        code: 'view_attachments_section_onboard',
        name: 'View Attachments in Specification',
        description: 'View attachments rights for project dry dock',
        action: Action.View,
        validOn: Location.Vessel,
    },
    {
        uid: 'F098C80B-FE09-4E7B-88FB-73DB3B084178',
        code: 'edit_header_section',
        name: 'Edit Header Section of Specification',
        description: 'Edit header section in specification',
        action: Action.Edit,
        validOn: Location.Office,
    },
    {
        uid: '20FDC417-FCDA-4869-BCF0-4119E03F82A4',
        code: 'edit_workflow',
        name: 'Edit Workflow in Specification',
        description: 'Edit Workflow in specification',
        action: Action.Edit,
        validOn: Location.Office,
    },
    {
        uid: '4A43BEE2-B4F6-40F1-B506-48F9660E9B92',
        code: 'edit_general_information',
        name: 'Edit General Information in Specification',
        description: 'Edit general information access rights for specification',
        action: Action.Edit,
        validOn: Location.Office,
    },
    {
        uid: '0F5B5B2E-369D-4C9B-9545-38C5A2B25213',
        code: 'edit_requisition',
        name: 'Edit Requisition in Specification',
        description: 'Edit Requisition access rights for specification',
        action: Action.Edit,
        validOn: Location.Office,
    },
    {
        uid: '0DCFF97C-003B-46DB-AB81-195F8E2CA7CB',
        code: 'add_sub_items',
        name: 'Add Sub Items in Specification',
        description: 'Add sub items access rights for specification',
        action: Action.Edit,
        validOn: Location.Office,
    },
    {
        uid: '899C004D-135B-4AEB-96EF-FF69AEF71980',
        code: 'edit_sub_items',
        name: 'Edit Sub Items in Specification',
        description: 'Edit sub items access rights for specification',
        action: Action.Edit,
        validOn: Location.Office,
    },
    {
        uid: '11C1DDC8-8D36-48BE-A4E2-6CBF416E4F97',
        code: 'delete_sub_items',
        name: 'Delete Sub Items in Specification',
        description: 'Delete sub items access rights for specification',
        action: Action.Edit,
        validOn: Location.Office,
    },
    {
        uid: 'E78179A6-1FA3-47D8-91AC-8F8AE3C3509F',
        code: 'add_attachments',
        name: 'Add Attachments in Specification',
        description: 'Add attachments rights for specification',
        action: Action.Edit,
        validOn: Location.Office,
    },
    {
        uid: '29FB7EFE-83E3-495C-AB06-7E0B693E3936',
        code: 'edit_attachments',
        name: 'Edit Attachments in Specification',
        description: 'Edit attachments rights for specification',
        action: Action.Edit,
        validOn: Location.Office,
    },
    {
        uid: 'EF48B6A0-B199-45E6-9283-95D21304EF5E',
        code: 'delete_attachments',
        name: 'Delete Attachment in Specification',
        description: 'Delete attachment rights for specification',
        action: Action.Edit,
        validOn: Location.Office,
    },
    {
        uid: '812AD6AE-8950-43AE-AE99-730690F0517F',
        code: 'edit_header_section_onboard',
        name: 'Edit Header Section of Specification',
        description: 'Edit header section in specification',
        action: Action.Edit,
        validOn: Location.Vessel,
    },
    {
        uid: '5727503A-C804-4895-AC6D-2783206BF784',
        code: 'edit_workflow_onboard',
        name: 'Edit Workflow in Specification',
        description: 'Edit Workflow in specification',
        action: Action.Edit,
        validOn: Location.Vessel,
    },
    {
        uid: '23D0B8BF-FFF7-48C7-82C8-21A4B7B5AACA',
        code: 'edit_general_information_onboard',
        name: 'Edit General Information in Specification',
        description: 'Edit general information access rights for specification',
        action: Action.Edit,
        validOn: Location.Vessel,
    },
    {
        uid: '5F5E7553-D662-4821-83C1-8A0FE6A7D7CC',
        code: 'edit_requisition_onboard',
        name: 'Edit Requisition in Specification',
        description: 'Edit Requisition access rights for specification',
        action: Action.Edit,
        validOn: Location.Vessel,
    },
    {
        uid: '7AA97778-8663-4FFD-9B08-7CBCCBA11D2C',
        code: 'add_sub_items_onboard',
        name: 'Add Sub Items in Specification',
        description: 'Add sub items access rights for specification',
        action: Action.Edit,
        validOn: Location.Vessel,
    },
    {
        uid: '96030422-8BB1-4F53-8A4F-9F6FD49CCD7B',
        code: 'edit_sub_items_onboard',
        name: 'Edit Sub Items in Specification',
        description: 'Edit sub items access rights for specification',
        action: Action.Edit,
        validOn: Location.Vessel,
    },
    {
        uid: '6E042F4C-6590-41B5-8578-338FBED53F44',
        code: 'delete_sub_items_onboard',
        name: 'Delete Sub Items in Specification',
        description: 'Delete sub items access rights for specification',
        action: Action.Edit,
        validOn: Location.Vessel,
    },
    {
        uid: 'F623ECB1-D71E-4BF8-BE20-30A617356CB6',
        code: 'add_attachments_onboard',
        name: 'Add Attachments in Specification',
        description: 'Add attachments rights for specification',
        action: Action.Edit,
        validOn: Location.Vessel,
    },
    {
        uid: '3C31C413-5651-4CDA-A14C-933B84DAD97A',
        code: 'edit_attachments_onboard',
        name: 'Edit Attachments in Specification',
        description: 'Edit attachments rights for specification',
        action: Action.Edit,
        validOn: Location.Vessel,
    },
    {
        uid: 'AF57F155-4466-4C02-B24A-134AB2C5E626',
        code: 'delete_attachments_onboard',
        name: 'Delete Attachments in Specification',
        description: 'Delete attachments rights for specification',
        action: Action.Edit,
        validOn: Location.Vessel,
    },
    {
        uid: '52BE32D8-C661-4D58-8A29-5A0EBDEE6068',
        code: 'delete_specification_detail',
        name: 'Delete Specification Detail',
        description: 'Delete specification detail',
        action: Action.Edit,
        validOn: Location.Office,
    },
    {
        uid: 'FCCCCE0F-CC5E-4CB6-9691-27D73B9025F6',
        code: 'delete_specification_detail_onboard',
        name: 'Delete Specification Detail',
        description: 'Delete specification detail',
        action: Action.Edit,
        validOn: Location.Vessel,
    },
    {
        uid: '6C692C98-26B4-4627-8603-87F69FFE3DDA',
        code: 'resync_record',
        name: 'Re-Sync Record for Specification',
        description: 'Re-Sync the record to other side in Specification',
        action: Action.Edit,
        validOn: Location.Office,
    },
    {
        uid: '5712F513-72C9-4EDC-85AF-D9B4C6BA2A98',
        code: 'resync_record_onboard',
        name: 'Re-Sync Record for Specification',
        description: 'Re-Sync the record to other side in Specification',
        action: Action.Edit,
        validOn: Location.Vessel,
    },
];

/** @private */
const enum Status {
    Success = 'S',
    Error = 'E',
}

export class CreateSpecificationDetailsAccessRights1701263296255 implements MigrationInterface {
    public readonly name = this.constructor.name;
    protected readonly moduleCode = 'project';
    protected readonly functionCode = 'specification_details';

    protected log(status: Status, details = ''): Promise<void> {
        const deleteMigration = status === Status.Error;

        return MigrationUtilsService.migrationLog(this.name, details, status, this.moduleCode, this.functionCode, deleteMigration);
    }

    protected async updateModuleAndFunctionModificationDate(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            update
                INF_Lib_Module
            set
                [Modified_By] = 1,
                [Date_Of_Modification] = getdate()
            where
                [Module_Code] = @0;
        `, [this.moduleCode]);

        await queryRunner.query(`
            update
                inf_lib_function
            set
                [Modified_By] = 1,
                [Date_Of_Modification] = getdate()
            where
                [Module_Code] = @0
                and
                [Function_Code] = @1;
        `, [this.moduleCode, this.functionCode]);
    }

    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.query(`
                insert into INF_Lib_Right (
                    [Module_Code],
                    [Function_Code],
                    [Right_UID],
                    [Right_Code],
                    [right_name],
                    [Right_Description],
                    [Action],
                    [Valid_On],
                    [Active_Status],
                    [Created_By],
                    [Date_Of_Creation],
                    [Modified_By],
                    [Date_Of_Modification],
                    [api_url]
                )
                values
                    ${accessRights.map((accessRight) => `(
                        @0,
                        @1,
                        '${accessRight.uid}',
                        '${accessRight.code}',
                        '${accessRight.name}',
                        '${accessRight.description}',
                        '${accessRight.action}',
                        '${accessRight.validOn}',
                        1,
                        1,
                        getdate(),
                        1,
                        getdate(),
                        NULL
                    )`)};
            `, [this.moduleCode, this.functionCode]);

            await this.updateModuleAndFunctionModificationDate(queryRunner);

            await this.log(Status.Success, 'Added access rights for Specification Details');
        } catch (error) {
            await this.log(Status.Error, JSON.stringify(error));
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.query(`
                delete from
                    INF_Lib_Right
                where
                    [Module_Code] = @0
                    and
                    [Function_Code] = @1
                    and
                    [Right_Code] in (${accessRights.map(({ code }) => (
                        `'${code}'`
                    ))});
            `, [this.moduleCode, this.functionCode]);

            await this.updateModuleAndFunctionModificationDate(queryRunner);

            await this.log(Status.Success, 'Deleted access rights for Specification Details');
        } catch (error) {
            await this.log(Status.Error, JSON.stringify(error));
        }
    }
}
