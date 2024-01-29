import { MigrationUtilsService } from "j2utils";
import { MigrationInterface, QueryRunner } from "typeorm";
import { errorLikeToString } from "../../common/drydock/ts-helpers/error-like-to-string";

/** @private */
const enum Status {
    Success = 'S',
    Error = 'E',
}

export class AssignSpecificationDetailsToClientAdminRole1703161706018 implements MigrationInterface {
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
                if exists (
                    select top 1
                        *
                    from
                        INF_Lib_Roles
                    where
                        Role = 'Client Admin'
                        and
                        Active_Status = 1
                )
                begin
                    declare @role_id int;

                    set @role_id = (
                        select top 1
                            Role_ID
                        from
                            INF_Lib_Roles
                        where
                            Role = 'Client Admin'
                            and
                            Active_Status = 1
                    );

                    merge into
                        INF_Lib_RoleGroupsRights as target
                    using (
                        values
                            (
                                '304B69A9-6A7B-40FA-A3A3-4A601D73D288',
                                @role_id,
                                'view_specification_detail'
                            ),(
                                'FD131247-0D2F-4F59-A69F-AB6F53645D50',
                                @role_id,
                                'view_specification_detail_onboard'
                            ),(
                                '2384B078-99F9-4F97-BC06-4BE873A9D2E5',
                                @role_id,
                                'edit_specification_detail'
                            ),(
                                '45BF3EF5-E3DF-45BF-9FBB-93704BD2A12D',
                                @role_id,
                                'edit_specification_detail_onboard'
                            ),(
                                'F4F4CF4F-5EDC-494C-A94E-02DDC9D354FF',
                                @role_id,
                                'delete_specification'
                            ),(
                                '3658ACFE-AAEB-4A5C-AACD-EFA8F066BF2C',
                                @role_id,
                                'delete_specification_onboard'
                            )
                    ) as source (
                        [RGR_UID],
                        [RGR_Role_ID],
                        [RGR_Group_Code]
                    )
                        on
                            target.RGR_UID = source.RGR_UID
                    when matched then
                        update
                            set
                                target.[RGR_UID] = source.[RGR_UID],
                                target.[RGR_Role_ID] = source.[RGR_Role_ID],
                                target.[RGR_Group_Code] = source.[RGR_Group_Code],
                                target.[Modified_By] = 1,
                                target.[Date_Of_Modification] = getdate()
                    when not matched then
                        insert (
                            [RGR_UID],
                            [RGR_Role_ID],
                            [RGR_Group_Code],
                            [Created_By],
                            [Date_Of_Creation],
                            [Active_Status]
                        )
                        values (
                            source.[RGR_UID],
                            source.[RGR_Role_ID],
                            source.[RGR_Group_Code],
                            1,
                            getdate(),
                            1
                        )
                    ;
                end;
            `);

            await queryRunner.query(`
                if exists (
                    select top 1
                        *
                    from
                        INF_Lib_Roles
                    where
                        Role = 'JiBe Crew Implementation'
                        and
                        Active_Status = 1
                )
                begin
                    declare @role_id int;

                    set @role_id = (
                        select top 1
                            Role_ID
                        from
                            INF_Lib_Roles
                        where
                            Role = 'JiBe Crew Implementation'
                            and
                            Active_Status = 1
                    );

                    merge into
                        INF_Lib_RoleGroupsRights as target
                    using (
                        values
                            (
                                '01E3B612-D696-4C10-BB27-4650834D0AC6',
                                @role_id,
                                'view_specification_detail'
                            ),(
                                'A3D186F1-09B6-4240-A5C8-2AFC8D88B01A',
                                @role_id,
                                'view_specification_detail_onboard'
                            ),(
                                'CA41A848-9A46-4DD4-B84A-CDACFEB68BD3',
                                @role_id,
                                'edit_specification_detail'
                            ),(
                                '0B05489C-D2B7-4E70-8590-F68F6A2B6619',
                                @role_id,
                                'edit_specification_detail_onboard'
                            ),(
                                'BE1F2FA3-6659-49F1-8DCC-A8E29250A46E',
                                @role_id,
                                'delete_specification'
                            ),(
                                '4AF36945-9E51-4C02-AC81-6B37ED365939',
                                @role_id,
                                'delete_specification_onboard'
                            )
                    ) as source (
                        [RGR_UID],
                        [RGR_Role_ID],
                        [RGR_Group_Code]
                    )
                        on
                            target.RGR_UID = source.RGR_UID
                    when matched then
                        update
                            set
                                target.[RGR_UID] = source.[RGR_UID],
                                target.[RGR_Role_ID] = source.[RGR_Role_ID],
                                target.[RGR_Group_Code] = source.[RGR_Group_Code],
                                target.[Modified_By] = 1,
                                target.[Date_Of_Modification] = getdate()
                    when not matched then
                        insert (
                            [RGR_UID],
                            [RGR_Role_ID],
                            [RGR_Group_Code],
                            [Created_By],
                            [Date_Of_Creation],
                            [Active_Status]
                        )
                        values (
                            source.[RGR_UID],
                            source.[RGR_Role_ID],
                            source.[RGR_Group_Code],
                            1,
                            getdate(),
                            1
                        )
                    ;
                end;
            `);

            await this.log(Status.Success);
        } catch (error) {
            await this.log(Status.Error, errorLikeToString(error));
        }
    }

    public async down(): Promise<void> {}
}
