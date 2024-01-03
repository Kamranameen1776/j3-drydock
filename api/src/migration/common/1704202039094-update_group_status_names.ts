import { MigrationInterface, QueryRunner } from 'typeorm';
import { MigrationUtilsService } from 'j2utils';

export class updateGroupStatusNames1704202039094 implements MigrationInterface {
    tableName = 'project_type';
    schemaName = 'dry_dock';

    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.query(`
            IF EXISTS (Select *
               from INFORMATION_SCHEMA.TABLES
               where TABLE_NAME = '${this.tableName}'
                 AND TABLE_SCHEMA = '${this.schemaName}')

    BEGIN
        UPDATE "${this.schemaName}"."${this.tableName}" SET group_status_id = 'Closed' WHERE group_status_id = 'Close';
        UPDATE "${this.schemaName}"."${this.tableName}" SET group_status_id = 'Completed' WHERE group_status_id = 'Complete';
    END`);

            await MigrationUtilsService.migrationLog(
                'updateGroupStatusNames1704202039094',
                '',
                'S',
                'dry_dock',
                'Update group status names',
            );
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                'updateGroupStatusNames1704202039094',
                JSON.stringify(error),
                'E',
                'dry_dock',
                'Update group status names',
                true,
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
