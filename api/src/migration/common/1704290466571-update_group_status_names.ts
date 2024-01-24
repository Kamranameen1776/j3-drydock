import { MigrationInterface, QueryRunner } from 'typeorm';
import { MigrationUtilsService } from 'j2utils';
import { errorLikeToString } from "../../common/drydock/ts-helpers/error-like-to-string";

export class updateGroupStatusNames1704290466571 implements MigrationInterface {
    tableName = 'group_project_status';
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
                'updateGroupStatusNames1704290466571',
                '',
                'S',
                'dry_dock',
                'Update group status names',
            );
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                'updateGroupStatusNames1704290466571',
                errorLikeToString(error),
                'E',
                'dry_dock',
                'Update group status names',
                true,
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
