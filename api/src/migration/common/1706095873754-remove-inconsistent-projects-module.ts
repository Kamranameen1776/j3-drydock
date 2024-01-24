import { MigrationUtilsService } from 'j2utils';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { errorLikeToString } from '../../common/drydock/ts-helpers/error-like-to-string';

/** @private */
const enum Status {
    Success = 'S',
    Error = 'E',
}

export class RemoveInconsistentProjectsModule1706095873754 implements MigrationInterface {
    public readonly name = this.constructor.name;
    protected readonly moduleName = 'Projects';
    public readonly description = `Delete unused '${this.moduleName}' parent module`;

    protected async log(status: Status, message = this.description): Promise<void> {
        const deleteMigration = status === Status.Error;

        await MigrationUtilsService.migrationLog(this.name, message, status, '', '', deleteMigration);
    }

    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.query(`
                -- find Module_Code of the to-be-deleted module,
                -- assuming that there's only one such module
                declare @module_code varchar(max);

                select
                    @module_code = Module_Code
                from
                    INF_Lib_Module
                where
                    parent_module_code is null
                    and
                    Module_Name = @0
                ;

                -- make sure that no other modules and functions depend on the to-be-deleted module
                if exists (
                    select
                        *
                    from
                        INF_Lib_Module
                    where
                        parent_module_code = @module_code
                )
                begin
                    throw 16, 'Cannot delete module: found dependent modules', 1;
                end
                else if exists (
                    select
                        *
                    from
                        INF_Lib_function
                    where
                        @module_code in (
                            parent_module_code,
                            Module_Code
                        )
                )
                begin
                    throw 16, 'Cannot delete module: found dependent functions', 1;
                end
                else
                begin
                    delete from
                        INF_Lib_Module
                    where
                        parent_module_code is null
                        and
                        Module_Code = @module_code
                end;
            `, [this.moduleName]);

            await this.log(Status.Success);
        } catch (error) {
            await this.log(Status.Error, errorLikeToString(error));
        }
    }

    public async down(): Promise<void> {}
}
