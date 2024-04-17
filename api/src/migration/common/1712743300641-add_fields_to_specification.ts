import { MigrationInterface, QueryRunner } from 'typeorm';
import { MigrationUtilsService } from 'j2utils';
import { QueryStrings } from '../../shared/enum/queryStrings.enum';

export class addFieldsToSpecification1712743300641 implements MigrationInterface {
    className: string = this.constructor.name;
    moduleName: string = 'project';
    schemaName = 'dry_dock';
    tableName = 'specification_details';
    message = `Add new fields to ${this.schemaName}.${this.tableName}`;

    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.query(`
            IF NOT EXISTS (Select *
               from INFORMATION_SCHEMA.COLUMNS
               where TABLE_NAME = '${this.tableName}'
                 AND TABLE_SCHEMA = '${this.schemaName}'
                 AND COLUMN_NAME IN
                     ('estimated_cost',
                     'overall_cost',
                     'buffer_time',
                     'gl_account_uid',
                     'job_execution_uid',
                     'estimated_budget',
                      'job_required')
                      )

            BEGIN
                ALTER TABLE ${this.schemaName}.${this.tableName}
    ADD buffer_time decimal(20, 2) NOT NULL DEFAULT 0,
        gl_account_uid UNIQUEIDENTIFIER NULL,
        job_execution_uid UNIQUEIDENTIFIER NULL,
        estimated_budget decimal(20, 2) NOT NULL DEFAULT 0,
        estimated_cost decimal(20, 2) NOT NULL DEFAULT 0,
        overall_cost decimal(20, 2) NOT NULL DEFAULT 0,
        job_required varchar(10) NOT NULL DEFAULT '${QueryStrings.Yes}';
            END;
            `);

            await MigrationUtilsService.migrationLog(this.className, '', 'S', this.moduleName, this.message);
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                this.className,
                error as string,
                'E',
                this.moduleName,
                this.message,
                true,
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
