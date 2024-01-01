import { MigrationUtilsService } from 'j2utils';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterDailyReportTables1703686045424 implements MigrationInterface {
    tableName = 'daily_report_updates';
    schemaName = 'dry_dock';
    className = this.constructor.name;
    moduleName = 'dry_dock';
    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.query(`
            ALTER TABLE [${this.schemaName}].[${this.tableName}] ADD update_date [datetimeoffset] NULL;
            ALTER TABLE [${this.schemaName}].[${this.tableName}] ADD specification_uid [uniqueidentifier] NULL;
            ALTER TABLE [${this.schemaName}].[${this.tableName}] ADD status [varchar](50) NULL;
            ALTER TABLE [${this.schemaName}].[${this.tableName}] ADD progress [int] NULL;
            ALTER TABLE [${this.schemaName}].[${this.tableName}] DROP COLUMN update_date;
            `);

            await MigrationUtilsService.migrationLog(
                this.className,
                '',
                'S',
                this.moduleName,
                `Update table ${this.tableName}`,
            );
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                this.className,
                error as string,
                'E',
                this.moduleName,
                `Update table ${this.tableName}`,
                true,
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
