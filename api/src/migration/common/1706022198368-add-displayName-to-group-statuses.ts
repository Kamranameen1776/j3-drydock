import { MigrationInterface, QueryRunner } from 'typeorm';
import { MigrationUtilsService } from 'j2utils';

export class addDsiplayNameToGroupStatuses1706022198368 implements MigrationInterface {
    schemaName = 'dry_dock';
    className = this.constructor.name;
    moduleName = 'dry_dock';
    tableName = 'group_project_status'
    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.query(`
            IF NOT EXISTS (Select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = '${this.tableName}' AND TABLE_SCHEMA = '${this.schemaName}' AND COLUMN_NAME = 'display_name')
            BEGIN
                alter table dry_dock.group_project_status add display_name varchar(128);
            END
            `);

            await queryRunner.query(`
            IF NOT EXISTS (Select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = '${this.tableName}' AND TABLE_SCHEMA = '${this.schemaName}' AND COLUMN_NAME = 'status_order')
            BEGIN
                alter table dry_dock.group_project_status add status_order int default 0;
            END
            `);

            await MigrationUtilsService.migrationLog(
                this.className,
                '',
                'S',
                this.moduleName,
                `Update ${this.tableName}`,
            );
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                this.className,
                error as string,
                'E',
                this.moduleName,
                `Update ${this.tableName}`,
                true,
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
