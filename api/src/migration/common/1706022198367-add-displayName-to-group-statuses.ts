import { MigrationInterface, QueryRunner } from 'typeorm';
import { MigrationUtilsService } from 'j2utils';

export class addDsiplayNameToGroupStatuses1706022198367 implements MigrationInterface {
    schemaName = 'dry_dock';
    className = this.constructor.name;
    moduleName = 'dry_dock';
    tableName: 'group_project_status'
    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.query(`
            IF NOT EXISTS (Select *
               from INFORMATION_SCHEMA.COLUMNS
               where TABLE_NAME = '${this.tableName}'
                 AND TABLE_SCHEMA = '${this.schemaName}'
                 AND COLUMN_NAME = 'display_name' )

            BEGIN
            alter table dry_dock.group_project_status add display_name varchar(128);
            UPDATE dry_dock.group_project_status SET display_name = N'Specification Planning' WHERE group_status_id = N'Planned';
            UPDATE dry_dock.group_project_status SET display_name = N'Yard Selection' WHERE group_status_id = N'Active';
            UPDATE dry_dock.group_project_status SET display_name = N'In Progress' WHERE group_status_id = N'Completed';
            UPDATE dry_dock.group_project_status SET display_name = N'Closed' WHERE group_status_id = N'Closed';
            END
            `);

            await MigrationUtilsService.migrationLog(
                this.className,
                '',
                'S',
                this.moduleName,
                `Update length for varchars`,
            );
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                this.className,
                error as string,
                'E',
                this.moduleName,
                `Update length for varchars`,
                true,
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
