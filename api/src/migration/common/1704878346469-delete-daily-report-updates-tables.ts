import { MigrationUtilsService } from 'j2utils';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class deleteDailyReportUpdatesTables1704878346469 implements MigrationInterface {
    tableName = 'daily_report_updates';
    schemaName = 'dry_dock';
    className = this.constructor.name;
    moduleName = 'dry_dock';
    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.query(`
            IF EXISTS (Select * from INFORMATION_SCHEMA.TABLES
                where TABLE_NAME = '${this.tableName}' AND TABLE_SCHEMA = '${this.schemaName}')
            BEGIN
            DROP TABLE [${this.schemaName}].[${this.tableName}]
            END
            `);

            await MigrationUtilsService.migrationLog(
                this.className,
                '',
                'S',
                this.moduleName,
                `Drop table ${this.tableName}`,
            );
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                this.className,
                error as string,
                'E',
                this.moduleName,
                `Drop table ${this.tableName}`,
                true,
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
