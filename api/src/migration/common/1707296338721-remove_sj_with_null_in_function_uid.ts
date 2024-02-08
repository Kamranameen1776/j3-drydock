import {MigrationInterface, QueryRunner} from "typeorm";
import { MigrationUtilsService } from 'j2utils';

export class removeSjWithNullInFunctionUid1707296338721 implements MigrationInterface {
    schemaName = 'dry_dock';
    className = this.constructor.name;
    moduleName = 'dry_dock';
    tableName = 'standard_jobs'
    subTableName = 'standard_jobs_sub_items'
    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.query(`
            BEGIN
                DELETE FROM ${this.schemaName}.${this.subTableName} WHERE standard_job_uid IN (SELECT uid FROM ${this.schemaName}.${this.tableName} WHERE function_uid IS NULL);
                DELETE FROM ${this.schemaName}.${this.tableName} WHERE function_uid IS NULL;
            END;
            BEGIN
                ALTER TABLE ${this.schemaName}.${this.tableName} ALTER COLUMN function_uid uniqueidentifier NOT NULL;
            END;
            `);

            await MigrationUtilsService.migrationLog(
                this.className,
                '',
                'S',
                this.moduleName,
                `Remove standard_jobs with null in function_uid and set column to not null`,
            );
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                this.className,
                error as string,
                'E',
                this.moduleName,
                `Remove standard_jobs with null in function_uid and set column to not null`,
                true,
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
