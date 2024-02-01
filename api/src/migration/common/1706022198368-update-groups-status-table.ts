import { MigrationInterface, QueryRunner } from 'typeorm';
import { MigrationUtilsService } from 'j2utils';

export class updateGroupsStatusTable1706022198368 implements MigrationInterface {
    schemaName = 'dry_dock';
    className = this.constructor.name;
    moduleName = 'dry_dock';
    tableName = 'group_project_status'
    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.query(`
            UPDATE dry_dock.group_project_status SET display_name = N'Specification Planning', status_order = 1 WHERE group_status_id = N'Planned';
            UPDATE dry_dock.group_project_status SET display_name = N'Yard Selection', status_order = 2 WHERE group_status_id = N'Active';
            UPDATE dry_dock.group_project_status SET display_name = N'In Progress', status_order = 3 WHERE group_status_id = N'Completed';
            UPDATE dry_dock.group_project_status SET display_name = N'Closed', status_order = 4 WHERE group_status_id = N'Closed';
            `);

            await MigrationUtilsService.migrationLog(
                this.className,
                '',
                'S',
                this.moduleName,
                `Update data in ${this.tableName}`,
            );
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                this.className,
                error as string,
                'E',
                this.moduleName,
                `Update data in ${this.tableName}`,
                true,
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
