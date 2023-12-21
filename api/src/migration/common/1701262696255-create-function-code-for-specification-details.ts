import { MigrationUtilsService } from "j2utils";
import { MigrationInterface, QueryRunner } from "typeorm";

/** @private */
const enum Status {
    Success = 'S',
    Error = 'E',
}

export class CreateFunctionCodeForSpecificationDetails1701262696255 implements MigrationInterface {
    public readonly name = this.constructor.name;
    protected readonly moduleCode = 'project';
    protected readonly functionCode = 'specification_details';
    protected readonly functionUid = '660941D8-B00B-4C58-AD32-1F0A144B1C88';

    protected log(status: Status, details = ''): Promise<void> {
        const deleteMigration = status === Status.Error;

        return MigrationUtilsService.migrationLog(this.name, details, status, this.moduleCode, this.functionCode, deleteMigration);
    }

    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
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
                insert into inf_lib_function
                    (
                        [FunctionId],
                        [Function_UID],
                        [Module_Code],
                        [Function_Code],
                        [Function_Name],
                        [Created_By],
                        [Date_Of_Creation],
                        [Modified_By],
                        [Date_Of_Modification],
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
                                inf_lib_function
                        ),
                        @2,
                        @0,
                        @1,
                        'Specification Details',
                        1,
                        getdate(),
                        1,
                        NULL,
                        1,
                        NULL,
                        (
                            select distinct
                                [parent_module_code]
                            from
                                INF_Lib_Module
                            where
                                [Module_Code] = @0
                        ),
                        'specification_attachment'
                    );
            `, [this.moduleCode, this.functionCode, this.functionUid]);

            await this.log(Status.Success, `Created function code '${this.functionCode}' in module '${this.moduleCode}'`);
        } catch (error) {
            await this.log(Status.Error, JSON.stringify(error));
        }
    }

    public async down(): Promise<void> {}
}
