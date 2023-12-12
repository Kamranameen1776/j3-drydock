import { MigrationUtilsService } from "j2utils";
import { MigrationInterface, QueryRunner } from "typeorm";

/** @private */
const enum Location {
    Office = 'o',
    Vessel = 'v',
}

/**
 * @private
 * This table is static, its content persist across environments
 */
const enum UserTypeUid {
    OfficeUser = '3C084885-783B-46B8-9635-B2F70CC49218',
    SeaStaff = '0F3613B9-9FB5-40E6-8763-FC4941136598',
}

/** @private */
const userTypeUidByLocation = {
    [Location.Office]: UserTypeUid.OfficeUser,
    [Location.Vessel]: UserTypeUid.SeaStaff,
} satisfies Record<Location, UserTypeUid>;

/**
 * @private
 * This table is static, its content persist across environments
 */
const enum RoleId {
    Master = 10181,
    CE = 10183,
    CO = 10184,
}

/** @private */
interface RoleRef {
    readonly uid: string;
    readonly roleId: RoleId;
}

/** @private */
interface AccessRightGroup {
    readonly uid: string;
    readonly code: string;
    readonly name: string;
    readonly description: string;
    readonly validOn: Location;
    readonly roleRefs: RoleRef[];
}

/** @private */
const accessRightGroups: AccessRightGroup[] = [
    {
        uid: 'E32FE5EC-243A-4841-95E1-A1F5C4D16380',
        code: 'view_specification_detail',
        name: 'View Specification Detail - Office',
        description: 'View Specification Detail',
        validOn: Location.Office,
        roleRefs: [],
    },
    {
        uid: '0783A5B8-7631-465B-8AD8-A98BB910EE08',
        code: 'view_specification_detail_onboard',
        name: 'View Specification Detail Onboard',
        description: 'View Specification Detail Onboard',
        validOn: Location.Vessel,
        roleRefs: [
            {
                uid: '3710E5AD-8DFD-4027-B2E6-08BFB059FBD6',
                roleId: RoleId.Master,
            },
            {
                uid: 'BB0A66D4-8BFB-4FFD-952B-9813E4BA8AD0',
                roleId: RoleId.CE,
            },
            {
                uid: 'AD8A55CD-BA80-42AC-8E3B-EB9F2598C1D9',
                roleId: RoleId.CO,
            },
        ],
    },
    {
        uid: 'C788122C-31C5-4617-BCF2-978559E9AC80',
        code: 'edit_specification_detail',
        name: 'Edit Specification Detail',
        description: 'Edit Specification Detail',
        validOn: Location.Office,
        roleRefs: [],
    },
    {
        uid: '1E2E4EC3-E2DF-462D-8A4F-A0C64FBE88AE',
        code: 'edit_specification_detail_onboard',
        name: 'Edit Specification Detail Onboard',
        description: 'Edit Specification Detail Onboard',
        validOn: Location.Vessel,
        roleRefs: [
            {
                uid: '6DA82789-57F8-4830-B67A-CAEE456517EE',
                roleId: RoleId.Master,
            },
            {
                uid: '36103B64-9B7E-4729-970F-769527B580C3',
                roleId: RoleId.CE,
            },
            {
                uid: '4A9FE6F4-5FF3-44EF-8911-02B2F1712323',
                roleId: RoleId.CO,
            },
        ],
    },
    {
        uid: '91D01CC0-D182-409D-988A-C3BACB9D8230',
        code: 'delete_specification',
        name: 'Delete Specification',
        description: 'Delete Specification',
        validOn: Location.Office,
        roleRefs: [],
    },
    {
        uid: '3845DAAF-F73C-4CB4-A6DA-5E0B01AC445A',
        code: 'delete_specification_onboard',
        name: 'Delete Specification Onboard',
        description: 'Delete Specification Onboard',
        validOn: Location.Vessel,
        roleRefs: [
            {
                uid: '044555CD-D3CB-4BAF-88C5-BDA0E424DC77',
                roleId: RoleId.Master,
            },
            {
                uid: '05749A40-7338-410D-8357-C75A229ECBF5',
                roleId: RoleId.CE,
            },
            {
                uid: '482257DA-9573-4FEB-9E90-12811F3BB455',
                roleId: RoleId.CO,
            },
        ],
    },
];

/** @private */
const enum Status {
    Success = 'S',
    Error = 'E',
}

export class DefineSpecificationDetailsAccessRightGroups1702371560616 implements MigrationInterface {
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
                insert into INF_Lib_Group (
                    [Group_UID],
                    [Group_Code],
                    [group_name],
                    [Group_Description],
                    [user_type_uid],
                    [Created_By],
                    [Date_Of_Creation],
                    [Active_Status]
                ) values
                    ${accessRightGroups.map((group) => `(
                        '${group.uid}',
                        '${group.code}',
                        '${group.name}',
                        '${group.description}',
                        '${userTypeUidByLocation[group.validOn]}',
                        1,
                        getdate(),
                        1
                    )`)};
            `);

            await queryRunner.query(`
                insert into INF_Lib_RoleGroupsRights (
                    [RGR_UID],
                    [RGR_Role_ID],
                    [RGR_Group_Code],
                    [Created_By],
                    [Date_Of_Creation],
                    [Active_Status]
                )
                values
                    ${accessRightGroups.flatMap((group) => group.roleRefs.map((roleRef) => `(
                        '${roleRef.uid}',
                        ${roleRef.roleId},
                        '${group.code}',
                        1,
                        getdate(),
                        1
                    )`))};
            `);

            await this.updateModuleAndFunctionModificationDate(queryRunner);

            await this.log(Status.Success, 'Defined access right groups for Specification Details');
        } catch (error) {
            await this.log(Status.Error, JSON.stringify(error));
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.query(`
                delete from
                    INF_Lib_RoleGroupsRights
                where
                    [RGR_UID] in (${accessRightGroups.flatMap((group) => group.roleRefs.map(({ uid }) => (
                        `'${uid}'`
                    )))};
            `);

            await queryRunner.query(`
                delete from
                    INF_Lib_Group
                where
                    [Group_Code] in (${accessRightGroups.map(({ code }) => (
                        `'${code}'`
                    ))});
            `);

            await this.updateModuleAndFunctionModificationDate(queryRunner);

            await this.log(Status.Success, 'Deleted access right groups for Specification Details');
        } catch (error) {
            await this.log(Status.Error, JSON.stringify(error));
        }
    }
}
