import { MigrationUtilsService } from "j2utils";
import { MigrationInterface, QueryRunner } from "typeorm";
import { errorLikeToString } from "../../common/drydock/ts-helpers/error-like-to-string";

/** @private */
const enum Status {
    Success = 'S',
    Error = 'E',
}

export class AlignModuleCodesForFunctionsSpecificationAndSpecificationDetails1703604035319 implements MigrationInterface {
    public readonly name = this.constructor.name
    protected readonly moduleCode = 'project';
    protected readonly functionCode = 'specification_details';

    protected log(status: Status, details = ''): Promise<void> {
        const deleteMigration = status === Status.Error;

        return MigrationUtilsService.migrationLog(this.name, details, status, this.moduleCode, this.functionCode, deleteMigration);
    }

    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.query(`
                update
                    [INF_Lib_Function]
                set
                    [parent_module_code] = 'project_main',
                    [Module_Code] = 'project_main',
                    [Modified_By] = 1,
                    [Date_Of_Modification] = getdate()
                where
                    [Function_Code] = 'specification'
                ;
            `);

            await queryRunner.query(`
                update
                    [INF_Lib_Function]
                set
                    [parent_module_code] = 'project_main',
                    [Modified_By] = 1,
                    [Date_Of_Modification] = getdate()
                where
                    [Function_Code] = 'specification_details'
                ;
            `);

            await queryRunner.query(`
                update
                    [INF_Lib_Module]
                set
                    [Modified_By] = 1,
                    [Date_Of_Modification] = getdate()
                where
                    [Module_Code] = 'project_main'
                ;
            `);

            await this.log(Status.Success);
        } catch (error) {
            await this.log(Status.Error, errorLikeToString(error));
        }
    }

    public async down(): Promise<void> {}
}
