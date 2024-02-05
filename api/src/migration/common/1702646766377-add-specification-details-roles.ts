import { MigrationUtilsService } from "j2utils";
import { MigrationInterface, QueryRunner } from "typeorm";
import { errorLikeToString } from "../../common/drydock/ts-helpers/error-like-to-string";

/** @private */
interface GroupRef {
    /** UID of the reference, not the group itself */
    readonly uid: string;
    readonly groupCode: string;
}

/** @private */
interface Role {
    readonly uid: string;
    readonly name: string;
    readonly description: string;
    readonly groupRefs: GroupRef[];
}

/** @private */
const roles: Role[] = [
    {
        uid: 'BDCB89E5-F70D-4852-9C1D-4EFF18F44730',
        name: 'Master',
        description: 'Onboard Roles - Master',
        groupRefs: [
            {
                uid: '3710E5AD-8DFD-4027-B2E6-08BFB059FBD6',
                groupCode: 'view_specification_detail_onboard',
            },
            {
                uid: 'BB0A66D4-8BFB-4FFD-952B-9813E4BA8AD0',
                groupCode: 'edit_specification_detail_onboard',
            },
            {
                uid: 'AD8A55CD-BA80-42AC-8E3B-EB9F2598C1D9',
                groupCode: 'delete_specification_onboard',
            },
        ],
    },
    {
        uid: '92440273-C182-4E4A-8532-913896C43F99',
        name: 'C/E',
        description: 'Onboard Roles - C/E',
        groupRefs: [
            {
                uid: '6DA82789-57F8-4830-B67A-CAEE456517EE',
                groupCode: 'view_specification_detail_onboard',
            },
            {
                uid: '36103B64-9B7E-4729-970F-769527B580C3',
                groupCode: 'edit_specification_detail_onboard',
            },
            {
                uid: '4A9FE6F4-5FF3-44EF-8911-02B2F1712323',
                groupCode: 'delete_specification_onboard',
            },
        ],
    },
    {
        uid: 'B3C497D4-B175-4053-9458-D8D0274CB07B',
        name: 'C/O',
        description: 'Onboard Roles - C/O',
        groupRefs: [
            {
                uid: '044555CD-D3CB-4BAF-88C5-BDA0E424DC77',
                groupCode: 'view_specification_detail_onboard',
            },
            {
                uid: '05749A40-7338-410D-8357-C75A229ECBF5',
                groupCode: 'edit_specification_detail_onboard',
            },
            {
                uid: '482257DA-9573-4FEB-9E90-12811F3BB455',
                groupCode: 'delete_specification_onboard',
            },
        ],
    },
];

/** @private */
const enum Status {
    Success = 'S',
    Error = 'E',
}

export class AddSpecificationDetailsRoles1702646766377 implements MigrationInterface {
    public readonly name = this.constructor.name;
    protected readonly moduleCode = 'project';
    protected readonly functionCode = 'specification_details';

    protected log(status: Status, details = ''): Promise<void> {
        const deleteMigration = status === Status.Error;

        return MigrationUtilsService.migrationLog(this.name, details, status, this.moduleCode, this.functionCode, deleteMigration);
    }

    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.query(`
                declare @user_type_uid_sea_staff uniqueidentifier;
                set @user_type_uid_sea_staff = (
                    select uid from LIB_USER_TYPE where USER_TYPE = 'SEA STAFF'
                );

                declare @max_role_id int;
                set @max_role_id = (
                    select max(Role_ID) from INF_Lib_Roles
                );

                merge into
                    INF_Lib_Roles as target
                using
                    (
                        values
                            ${roles.map((role, index) => `(
                                ${index + 1},
                                '${role.uid}',
                                '${role.name}',
                                '${role.description}'
                            )`)}
                    ) as source (
                        role_id_increment,
                        role_uid,
                        role_name,
                        role_description
                    )
                on
                    target.uid = source.role_uid
                when not matched then
                    insert (
                        uid,
                        Role_ID,
                        Role,
                        Description,
                        user_type_uid,
                        Created_By,
                        Date_Of_Created,
                        Active_Status,
                        JITRole
                    )
                    values (
                        source.role_uid,
                        @max_role_id + source.role_id_increment,
                        source.role_name,
                        source.role_description,
                        @user_type_uid_sea_staff,
                        1,
                        getdate(),
                        1,
                        0
                    )
                ;
            `);

            await queryRunner.query(`
                merge into
                    INF_Lib_RoleGroupsRights as target
                using
                    (
                        values
                            ${roles.flatMap((role) => role.groupRefs.map((groupRef) => `(
                                '${groupRef.uid}',
                                '${role.uid}',
                                '${groupRef.groupCode}'
                            )`))}
                    ) as source (
                        uid,
                        role_uid,
                        group_code
                    )
                on
                    target.RGR_UID = source.uid
                when matched then
                    update
                        set
                            RGR_Role_ID = (
                                select
                                    Role_ID
                                from
                                    INF_Lib_Roles as role
                                where
                                    role.uid = source.role_uid
                            ),
                            RGR_Group_Code = source.group_code,
                            Modified_By = 1,
                            Date_Of_Modification = getdate()
                when not matched then
                    insert (
                        RGR_UID,
                        RGR_Role_ID,
                        RGR_Group_Code,
                        Created_By,
                        Date_Of_Creation,
                        Active_Status
                    )
                    values (
                        source.uid,
                        (
                            select
                                Role_ID
                            from
                                INF_Lib_Roles as role
                            where
                                role.uid = source.role_uid
                        ),
                        source.group_code,
                        1,
                        getdate(),
                        1
                    )
                ;
            `);

            await this.log(Status.Success);
        } catch (error) {
            await this.log(Status.Error, errorLikeToString(error));
        }
    }

    public async down(): Promise<void> {}
}
