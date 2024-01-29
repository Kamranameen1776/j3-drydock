import { MigrationUtilsService } from "j2utils";
import { MigrationInterface, QueryRunner } from "typeorm";
import { errorLikeToString } from "../../common/drydock/ts-helpers/error-like-to-string";

/** @private */
const enum Status {
    Success = 'S',
    Error = 'E',
}

export class AddParentFunctionForSpecificationDetailsFunction1702636460206 implements MigrationInterface {
    public readonly name = this.constructor.name;
    protected readonly moduleCode = 'project';
    protected readonly parentFunctionCode = 'specification';
    protected readonly parentFunctionUid = '28866419-0961-4055-92F8-CEEDDA1BB70F';
    protected readonly childFunctionCode = 'specification_details';
    protected readonly childFunctionUid = '660941D8-B00B-4C58-AD32-1F0A144B1C88';

    protected log(status: Status, details = ''): Promise<void> {
        const deleteMigration = status === Status.Error;

        return MigrationUtilsService.migrationLog(this.name, details, status, this.moduleCode, this.childFunctionCode, deleteMigration);
    }

    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.query(`
                insert into INF_Lib_Function
                    (
                        [FunctionId],
                        [Function_UID],
                        [Module_Code],
                        [Function_Code],
                        [Function_Name],
                        [Created_By],
                        [Date_Of_Creation],
                        [Active_Status],
                        [parent_function_code],
                        [parent_module_code],
                        [attach_prefix]
                    )
                values
                    (
                        1 + (
                            select
                                max(FunctionId)
                            from
                                [INF_Lib_Function]
                        ),
                        @2,
                        @0,
                        @1,
                        'Specification',
                        1,
                        getdate(),
                        1,
                        NULL,
                        (
                            select distinct
                                [parent_module_code]
                            from
                                [INF_Lib_Module]
                            where
                                [Module_Code] = @0
                        ),
                        NULL
                    );
            `, [this.moduleCode, this.parentFunctionCode, this.parentFunctionUid]);

            await queryRunner.query(`
                update
                    [INF_Lib_Module]
                set
                    [Modified_By] = 1,
                    [Date_Of_Modification] = getdate()
                where
                    [Module_Code] = @0;
            `, [this.moduleCode]);

            await queryRunner.query(`
                update
                    [INF_Lib_Function]
                set
                    [parent_function_code] = @3,
                    [Modified_By] = 1,
                    [Date_Of_Modification] = getdate()
                where
                    [Module_Code] = @0
                    and
                    [Function_Code] = @1
                    and
                    [Function_UID] = @2;
            `, [this.moduleCode, this.childFunctionCode, this.childFunctionUid, this.parentFunctionCode]);

            await this.log(Status.Success);
        } catch (error) {
            await this.log(Status.Error, errorLikeToString(error));
        }
    }

    public async down(): Promise<void> {}
}
