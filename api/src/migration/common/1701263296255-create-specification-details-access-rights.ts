import { MigrationUtilsService } from "j2utils";
import { MigrationInterface, QueryRunner } from "typeorm";

/** @private */
const enum Location {
    Office = 'o',
    Vessel = 'v',
}

/** @private */
interface AccessRightGroup {
    readonly code: string;
    readonly name: string;
    readonly validOn: Location;
}

/** @private */
const accessRightGroups: Record<string, AccessRightGroup> = {
    viewSpecificationDetail: {
        code: 'view_specification_detail',
        name: 'View Specification Detail',
        validOn: Location.Office,
    },
    viewSpecificationDetailOnboard: {
        code: 'view_specification_detail_onboard',
        name: 'View Specification Detail Onboard',
        validOn: Location.Vessel,
    },
    editSpecificationDetail: {
        code: 'edit_specification_detail',
        name: 'Edit Specification Detail',
        validOn: Location.Office,
    },
    editSpecificationDetailOnboard: {
        code: 'edit_specification_detail_onboard',
        name: 'Edit Specification Detail Onboard',
        validOn: Location.Vessel,
    },
    deleteSpecification: {
        code: 'delete_specification',
        name: 'Delete Specification',
        validOn: Location.Office,
    },
    deleteSpecificationOnboard: {
        code: 'delete_specification_onboard',
        name: 'Delete Specification Onboard',
        validOn: Location.Vessel,
    },
    taskManagerResync: {
        code: 'task_manager_resync',
        name: 'Task Manager Re-Sync',
        validOn: Location.Office,
    },
    taskManagerResyncOnboard: {
        code: 'task_manager_resync_onboard',
        name: 'Task Manager Re-Sync Onboard',
        validOn: Location.Vessel,
    },
};

/** @private */
interface AccessRightRecordInput {
    readonly group: AccessRightGroup;
    readonly uid: string;
    readonly code: string;
    readonly name: string;
    readonly action: string;
    readonly description: string;
    readonly groupRightUid: string;
    readonly rightUserTypeUid: string;
}

/** @private */
const accessRights: AccessRightRecordInput[] = [
    {
        group: accessRightGroups.viewSpecificationDetail,
        uid: '542D4F69-361B-4611-9EB8-675B5078A58D',
        code: 'view_specification_detail',
        name: 'View Specification Detail',
        action: 'view_spec',
        description: 'View specification detail page',
        groupRightUid: 'E2817682-424E-4157-90AB-9629ECC3C5F7',
        rightUserTypeUid: '4A5383B0-0460-4976-A077-BDA7439B7E37',
    },
    {
        group: accessRightGroups.viewSpecificationDetail,
        uid: 'E23AB67E-6A5D-4CFA-BF7B-CE1D9A879AF8',
        code: 'view_general_information_section',
        name: 'View General Information in Specification',
        action: 'view_gen_info_section',
        description: 'View General Information Section in Specification',
        groupRightUid: '9F92D96B-BD08-444E-A716-29DD7194FFB6',
        rightUserTypeUid: '7CDC7138-49F7-4BFD-91F7-16215D0F51BD',
    },
    {
        group: accessRightGroups.viewSpecificationDetail,
        uid: 'D1019F3E-4931-4906-8372-71189903D495',
        code: 'view_requisition_section',
        name: 'View Requisition in Specification',
        action: 'view_requisition_section',
        description: 'View Requisition Section in Specification',
        groupRightUid: 'A5DB1F58-F0D4-462E-90E5-24C1E113AB93',
        rightUserTypeUid: 'C382B7FE-00B7-45C5-8B3E-2B3ED2C7909A',
    },
    {
        group: accessRightGroups.viewSpecificationDetail,
        uid: '0B404328-13A0-4312-A8A1-982544A4DBBE',
        code: 'view_sub_items_section',
        name: 'View Sub Items in Specification',
        action: 'view_sub_items_section',
        description: 'View Sub Items Section in Specification',
        groupRightUid: '29D98CB1-8D27-460D-954F-5C13CBD19248',
        rightUserTypeUid: '80300DB1-1586-4922-B7B5-8B899B18A45D',
    },
    {
        group: accessRightGroups.viewSpecificationDetail,
        uid: '8EC05117-9F98-44F8-9C27-5F42AB0EF41F',
        code: 'view_findings_section',
        name: 'View Findings in Specification',
        action: 'view_findings_section',
        description: 'View Findings Section in Specification',
        groupRightUid: '65A34B8E-9574-4A55-991E-01777F62C1A6',
        rightUserTypeUid: '87EE73CF-9E04-45C3-9BA7-E28F66096F40',
    },
    {
        group: accessRightGroups.viewSpecificationDetail,
        uid: '9746E187-6931-4C7B-B154-50A8BAE422EE',
        code: 'view_pms_jobs_tab',
        name: 'View PMS Jobs in Specification',
        action: 'view_pms_jobs_tab',
        description: 'View PMS Jobs tab in Specification',
        groupRightUid: '439E0C7A-3B3C-4A0E-A841-2353E8D33145',
        rightUserTypeUid: 'E509C691-5A24-4989-9F63-8859D042FE82',
    },
    {
        group: accessRightGroups.viewSpecificationDetail,
        uid: '3A6AF4D8-7E51-414F-91F8-37CEAFC7BA25',
        code: 'view_attachments_section',
        name: 'View Attachments in Specification',
        action: 'view_attachments_section',
        description: 'View attachments rights for project dry dock',
        groupRightUid: '9488AF30-B2DF-4059-947A-E6650E4A0EC5',
        rightUserTypeUid: 'BA9635A5-22CA-4F0C-AADD-DB27144B3BC9',
    },
    {
        group: accessRightGroups.viewSpecificationDetailOnboard,
        uid: '248E5ED1-7989-410B-AE2F-18CFC9C91096',
        code: 'view_specification_detail_onboard',
        name: 'View Specification Detail',
        action: 'view_spec_onboard',
        description: 'View specification detail page',
        groupRightUid: '36C29322-F1F3-4F91-81BF-66A1AC0472AE',
        rightUserTypeUid: 'AFDD7A1A-BC68-4049-931E-C1BDE8521BF5',
    },
    {
        group: accessRightGroups.viewSpecificationDetailOnboard,
        uid: '177DA4F5-AB2C-49B7-9018-9442EB395C38',
        code: 'view_general_information_section_onboard',
        name: 'View General Information in Specification',
        action: 'view_gen_info_section_onboard',
        description: 'View General Information Section in Specification',
        groupRightUid: 'B3AEB5B2-E1F5-436B-A88B-4C9ACD9254DA',
        rightUserTypeUid: 'BA6E1B58-FD48-4BD1-8236-E24580DE1BD3',
    },
    {
        group: accessRightGroups.viewSpecificationDetailOnboard,
        uid: '17724742-CB7E-42DA-A363-12D8C81E8F1E',
        code: 'view_requisition_section_onboard',
        name: 'View Requisition in Specification',
        action: 'view_requisition_onboard',
        description: 'View Requisition Section in Specification',
        groupRightUid: '06D503DC-F0E8-4AB7-AED5-080747036E54',
        rightUserTypeUid: '3826C872-9D95-4DC4-8A05-8D31C601FA5E',
    },
    {
        group: accessRightGroups.viewSpecificationDetailOnboard,
        uid: 'B984E047-8679-4864-94E2-7CC6A1D259FB',
        code: 'view_sub_items_section_onboard',
        name: 'View Sub Items in Specification',
        action: 'view_sub_items_section_onboard',
        description: 'View Sub Items Section in Specification',
        groupRightUid: '273D4B12-29EC-4CFA-92C3-D51BD3333858',
        rightUserTypeUid: '6424E039-60E8-487F-BF7F-C0851F848FEF',
    },
    {
        group: accessRightGroups.viewSpecificationDetailOnboard,
        uid: '8A9C0668-C196-4388-B7D5-0CC1726044C5',
        code: 'view_findings_section_onboard',
        name: 'View Findings in Specification',
        action: 'view_findings_section_onboard',
        description: 'View Findings Section in Specification',
        groupRightUid: '78877EFE-D637-464A-8704-6FC271838CCD',
        rightUserTypeUid: 'EA908987-A7B0-4414-9800-E29D8BE9B5A3',
    },
    {
        group: accessRightGroups.viewSpecificationDetailOnboard,
        uid: 'B8E35313-00D5-4188-84F4-B29406E64E60',
        code: 'view_pms_jobs_tab_onboard',
        name: 'View PMS Jobs in Specification',
        action: 'view_pms_jobs_tab_onboard',
        description: 'View PMS Jobs tab in Specification',
        groupRightUid: 'D3267A2D-F4AD-48F2-9F21-EC6AC8AAAFB2',
        rightUserTypeUid: '15EC3531-1016-4B14-BEC1-CAB1C3CF9771',
    },
    {
        group: accessRightGroups.viewSpecificationDetailOnboard,
        uid: 'C9510BB1-8391-4268-BE9A-283E9DCAABA4',
        code: 'view_attachments_section_onboard',
        name: 'View Attachments in Specification',
        action: 'view_attachments_onboard',
        description: 'View attachments rights for project dry dock',
        groupRightUid: 'FB97FE89-AA70-4A5D-BD9C-2A5101CFC3D1',
        rightUserTypeUid: 'E41F1170-7F96-480F-AA1E-B32D2F3F757A',
    },
    {
        group: accessRightGroups.editSpecificationDetail,
        uid: 'F098C80B-FE09-4E7B-88FB-73DB3B084178',
        code: 'edit_header_section',
        name: 'Edit Header Section of Specification',
        action: 'edit_header_section',
        description: 'Edit header section in specification',
        groupRightUid: '9648F521-AAFE-4A67-8F11-C5DF9A718A68',
        rightUserTypeUid: '2E52A0F1-80FE-4869-8446-72EA5A54996D',
    },
    {
        group: accessRightGroups.editSpecificationDetail,
        uid: '20FDC417-FCDA-4869-BCF0-4119E03F82A4',
        code: 'edit_workflow',
        name: 'Edit Workflow in Specification',
        action: 'edit_workflow',
        description: 'Edit Workflow in specification',
        groupRightUid: 'D6117C8E-55D2-4C6C-B074-EC3A5827FE97',
        rightUserTypeUid: '319B6DD0-FD24-47F9-867E-1EFFF1C1F110',
    },
    {
        group: accessRightGroups.editSpecificationDetail,
        uid: '4A43BEE2-B4F6-40F1-B506-48F9660E9B92',
        code: 'edit_general_information',
        name: 'Edit General Information in Specification',
        action: 'edit_general_information',
        description: 'Edit general information access rights for specification',
        groupRightUid: '86DF611C-B9E9-458F-92D2-039583F84C10',
        rightUserTypeUid: 'DD094C68-FAFA-48E1-BB32-DFAD4B2806A5',
    },
    {
        group: accessRightGroups.editSpecificationDetail,
        uid: '0F5B5B2E-369D-4C9B-9545-38C5A2B25213',
        code: 'edit_requisition',
        name: 'Edit Requisition in Specification',
        action: 'edit_requisition',
        description: 'Edit Requisition access rights for specification',
        groupRightUid: 'A5E5B4BC-9D39-44D6-815C-C90D98FD15FC',
        rightUserTypeUid: '62B1A49C-3C48-4030-A2A4-C260E3E9E355',
    },
    {
        group: accessRightGroups.editSpecificationDetail,
        uid: '0DCFF97C-003B-46DB-AB81-195F8E2CA7CB',
        code: 'add_sub_items',
        name: 'Add Sub Items in Specification',
        action: 'add_sub_items',
        description: 'Add sub items access rights for specification',
        groupRightUid: 'A0159D7B-A600-474C-9EB5-04CE2B5BC880',
        rightUserTypeUid: '33B400A5-D7F3-43EA-A518-CC9A7053F8FB',
    },
    {
        group: accessRightGroups.editSpecificationDetail,
        uid: '899C004D-135B-4AEB-96EF-FF69AEF71980',
        code: 'edit_sub_items',
        name: 'Edit Sub Items in Specification',
        action: 'edit_sub_items',
        description: 'Edit sub items access rights for specification',
        groupRightUid: 'AD449116-8DD3-4F73-B1F6-502CE9AD32E9',
        rightUserTypeUid: 'CD31BB7F-AB17-4A06-913D-B907B3420FFD',
    },
    {
        group: accessRightGroups.editSpecificationDetail,
        uid: '11C1DDC8-8D36-48BE-A4E2-6CBF416E4F97',
        code: 'delete_sub_items',
        name: 'Delete Sub Items in Specification',
        action: 'delete_sub_items',
        description: 'Delete sub items access rights for specification',
        groupRightUid: 'CD6EF952-65E0-494F-BE25-9C1CF8DFC826',
        rightUserTypeUid: '8AAD40DD-E814-4E21-9DEA-995D9F74366F',
    },
    {
        group: accessRightGroups.editSpecificationDetail,
        uid: 'E78179A6-1FA3-47D8-91AC-8F8AE3C3509F',
        code: 'add_attachments',
        name: 'Add Attachments in Specification',
        action: 'add_attachments',
        description: 'Add attachments rights for specification',
        groupRightUid: 'A40B17BA-A74E-477A-9F57-443881358217',
        rightUserTypeUid: '93B98611-A62E-4640-8975-60818886765E',
    },
    {
        group: accessRightGroups.editSpecificationDetail,
        uid: '29FB7EFE-83E3-495C-AB06-7E0B693E3936',
        code: 'edit_attachments',
        name: 'Edit Attachments in Specification',
        action: 'edit_attachments',
        description: 'Edit attachments rights for specification',
        groupRightUid: '25FBA7C4-708F-46CA-857E-C50D8293E330',
        rightUserTypeUid: '3ACA4551-CA06-4223-957C-A1F4A6EA4C1C',
    },
    {
        group: accessRightGroups.editSpecificationDetail,
        uid: 'EF48B6A0-B199-45E6-9283-95D21304EF5E',
        code: 'delete_attachments',
        name: 'Delete Attachment in Specification',
        action: 'delete_attachments',
        description: 'Delete attachment rights for specification',
        groupRightUid: 'E33E6DC9-9EA9-4A72-9AFE-4363F1B77329',
        rightUserTypeUid: '3E866EA0-E16C-4DF8-910C-0260A7003A7C',
    },
    {
        group: accessRightGroups.editSpecificationDetailOnboard,
        uid: '812AD6AE-8950-43AE-AE99-730690F0517F',
        code: 'edit_header_section_onboard',
        name: 'Edit Header Section of Specification',
        action: 'edit_header_section_onboard',
        description: 'Edit header section in specification',
        groupRightUid: '5795A65C-FB17-4584-B9EB-BE8BEC8668B4',
        rightUserTypeUid: '5589678D-6DB7-49BA-9950-C1F26C4F4358',
    },
    {
        group: accessRightGroups.editSpecificationDetailOnboard,
        uid: '5727503A-C804-4895-AC6D-2783206BF784',
        code: 'edit_workflow_onboard',
        name: 'Edit Workflow in Specification',
        action: 'edit_workflow_onboard',
        description: 'Edit Workflow in specification',
        groupRightUid: 'E023C7D4-1A13-4E4A-A32E-8BEF4D9605DC',
        rightUserTypeUid: 'E9E6FF17-D19F-4973-A129-C74E0E30819D',
    },
    {
        group: accessRightGroups.editSpecificationDetailOnboard,
        uid: '23D0B8BF-FFF7-48C7-82C8-21A4B7B5AACA',
        code: 'edit_general_information_onboard',
        name: 'Edit General Information in Specification',
        action: 'edit_gen_info_onboard',
        description: 'Edit general information access rights for specification',
        groupRightUid: '45406201-EEFC-48D7-8FD5-4B92B65869A3',
        rightUserTypeUid: 'C408D7B4-5DA7-467B-91D8-72DA44E007F2',
    },
    {
        group: accessRightGroups.editSpecificationDetailOnboard,
        uid: '5F5E7553-D662-4821-83C1-8A0FE6A7D7CC',
        code: 'edit_requisition_onboard',
        name: 'Edit Requisition in Specification',
        action: 'edit_requisition_onboard',
        description: 'Edit Requisition access rights for specification',
        groupRightUid: '9301C2DD-0A9E-4FD3-90F9-F5FA22B41297',
        rightUserTypeUid: '585B3491-74BF-4B8E-B9AA-4091925DED0A',
    },
    {
        group: accessRightGroups.editSpecificationDetailOnboard,
        uid: '7AA97778-8663-4FFD-9B08-7CBCCBA11D2C',
        code: 'add_sub_items_onboard',
        name: 'Add Sub Items in Specification',
        action: 'add_sub_items_onboard',
        description: 'Add sub items access rights for specification',
        groupRightUid: '2FB01D4D-9FB0-4A91-8674-B5F4AD12DF69',
        rightUserTypeUid: '3134A455-D4E8-4BDD-BD3A-0FE100F3AB37',
    },
    {
        group: accessRightGroups.editSpecificationDetailOnboard,
        uid: '96030422-8BB1-4F53-8A4F-9F6FD49CCD7B',
        code: 'edit_sub_items_onboard',
        name: 'Edit Sub Items in Specification',
        action: 'edit_sub_items_onboard',
        description: 'Edit sub items access rights for specification',
        groupRightUid: '49402FB8-A1BF-4D2D-A167-19D599323AAA',
        rightUserTypeUid: 'F524CA7B-EA3E-4D04-8F82-7FE90F602B2B',
    },
    {
        group: accessRightGroups.editSpecificationDetailOnboard,
        uid: '6E042F4C-6590-41B5-8578-338FBED53F44',
        code: 'delete_sub_items_onboard',
        name: 'Delete Sub Items in Specification',
        action: 'delete_sub_items_onboard',
        description: 'Delete sub items access rights for specification',
        groupRightUid: '3C2A2156-E639-4134-A667-7EF2EA770B76',
        rightUserTypeUid: '45E17520-B965-45FF-8962-D341D2B169B6',
    },
    {
        group: accessRightGroups.editSpecificationDetailOnboard,
        uid: 'F623ECB1-D71E-4BF8-BE20-30A617356CB6',
        code: 'add_attachments_onboard',
        name: 'Add Attachments in Specification',
        action: 'add_attachments_onboard',
        description: 'Add attachments rights for specification',
        groupRightUid: 'BC36A0A7-6D54-4AC7-9A88-3BF89578D3A1',
        rightUserTypeUid: 'E2C8DB1A-E131-47FA-BE9D-099E793BC9DD',
    },
    {
        group: accessRightGroups.editSpecificationDetailOnboard,
        uid: '3C31C413-5651-4CDA-A14C-933B84DAD97A',
        code: 'edit_attachments_onboard',
        name: 'Edit Attachments in Specification',
        action: 'edit_attachments_onboard',
        description: 'Edit attachments rights for specification',
        groupRightUid: '5DFED7F8-A25A-4219-B9C3-5D00B9FC84C6',
        rightUserTypeUid: '40FF29EA-FBA1-41A2-A106-600BC61DA443',
    },
    {
        group: accessRightGroups.editSpecificationDetailOnboard,
        uid: 'AF57F155-4466-4C02-B24A-134AB2C5E626',
        code: 'delete_attachments_onboard',
        name: 'Delete Attachments in Specification',
        action: 'delete_attachments_onboard',
        description: 'Delete attachments rights for specification',
        groupRightUid: '9CBF90CF-4FAC-4578-A5A6-636DE94B6599',
        rightUserTypeUid: '2DE76991-6CAB-480E-90CD-4B7B8BCFA458',
    },
    {
        group: accessRightGroups.deleteSpecification,
        uid: '52BE32D8-C661-4D58-8A29-5A0EBDEE6068',
        code: 'delete_specification_detail',
        name: 'Delete Specification Detail',
        action: 'delete_spec',
        description: 'Delete specification detail',
        groupRightUid: '1D71286D-874C-4812-BF45-30A9C562711F',
        rightUserTypeUid: '7FD30454-11E6-4559-9419-69D822389A7E',
    },
    {
        group: accessRightGroups.deleteSpecificationOnboard,
        uid: 'FCCCCE0F-CC5E-4CB6-9691-27D73B9025F6',
        code: 'delete_specification_detail_onboard',
        name: 'Delete Specification Detail',
        action: 'delete_spec_onboard',
        description: 'Delete specification detail',
        groupRightUid: '4B0DBED6-55AC-4FA4-8BD3-254F51138144',
        rightUserTypeUid: 'E4587AF2-A569-4E32-9E61-D9582C3AEA0A',
    },
    {
        group: accessRightGroups.taskManagerResync,
        uid: '6C692C98-26B4-4627-8603-87F69FFE3DDA',
        code: 'resync_record',
        name: 'Re-Sync Record for Specification',
        action: 'resync_record',
        description: 'Re-Sync the record to other side in Specification',
        groupRightUid: '6A18F493-B0B1-405F-A328-DBE50342F7C0',
        rightUserTypeUid: 'EC287E07-A64E-462A-96F1-1FC6BF7AE284',
    },
    {
        group: accessRightGroups.taskManagerResyncOnboard,
        uid: '5712F513-72C9-4EDC-85AF-D9B4C6BA2A98',
        code: 'resync_record_onboard',
        name: 'Re-Sync Record for Specification',
        action: 'resync_record_onboard',
        description: 'Re-Sync the record to other side in Specification',
        groupRightUid: '49D9E1EE-0C62-4704-AB06-26E8A0BBCD0C',
        rightUserTypeUid: '98C5E935-AC2B-4839-82A4-0E31CABC1F6B',
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
        /** A mapping of `[Valid_On]` locations to corresponding names of SQL variables for user type UID */
        const userTypeVariableNameByLocation = {
            [Location.Office]: '@user_type_uid_office_user',
            [Location.Vessel]: '@user_type_uid_sea_staff',
        } satisfies Record<Location, string>;

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
                        '${accessRight.group.validOn}',
                        1,
                        1,
                        getdate(),
                        1,
                        getdate(),
                        NULL
                    )`)};
            `, [this.moduleCode, this.functionCode]);

            await queryRunner.query(`
                declare ${userTypeVariableNameByLocation[Location.Office]} varchar(50);
                declare ${userTypeVariableNameByLocation[Location.Vessel]} varchar(50);

                set ${userTypeVariableNameByLocation[Location.Office]} = (
                    select uid from lib_user_type where USER_TYPE = 'OFFICE USER'
                );

                set ${userTypeVariableNameByLocation[Location.Vessel]} = (
                    select uid from lib_user_type where USER_TYPE = 'SEA STAFF'
                );

                insert into INF_lnk_right_user_type (
                    [uid],
                    [right_code],
                    [user_type_uid],
                    [active_status],
                    [created_by],
                    [date_of_creation],
                    [modified_by],
                    [date_of_modification]
                )
                values
                    ${accessRights.map((accessRight) => `(
                        '${accessRight.rightUserTypeUid}',
                        '${accessRight.code}',
                        ${userTypeVariableNameByLocation[accessRight.group.validOn] ?? 'NULL'},
                        1,
                        1,
                        getdate(),
                        1,
                        getdate()
                    )`)};
            `);

            await queryRunner.query(`
                insert into inf_lib_grouprights (
                    [GR_UID],
                    [GR_Group_Code],
                    [GR_Right_Code],
                    [Created_By],
                    [Date_Of_Creation],
                    [Active_Status]
                )
                values
                    ${accessRights.map((accessRight) => `(
                        '${accessRight.groupRightUid}',
                        '${accessRight.group.code}',
                        '${accessRight.code}',
                        1,
                        getdate(),
                        1
                    )`)};
            `);

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
                    inf_lib_grouprights
                where
                    [GR_UID] in (${accessRights.map(({ groupRightUid }) => (
                        `'${groupRightUid}'`
                    ))});
            `);

            await queryRunner.query(`
                delete from
                    INF_lnk_right_user_type
                where
                    [uid] in (${accessRights.map(({ rightUserTypeUid }) => (
                        `'${rightUserTypeUid}'`
                    ))});
            `);

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
