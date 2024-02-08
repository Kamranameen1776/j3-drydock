import { MigrationInterface, QueryRunner } from 'typeorm';
import { MigrationUtilsService } from 'j2utils';
import { errorLikeToString } from '../../common/drydock/ts-helpers/error-like-to-string';

export class addCreatedByToJobOrder1707207770292 implements MigrationInterface {
    schemaName = 'dry_dock';
    tableName = 'job_orders';
    columnName = 'created_by';

    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.query(
                `
 IF NOT EXISTS (Select *
               from INFORMATION_SCHEMA.COLUMNS
               where TABLE_NAME = '${this.tableName}'
                 AND TABLE_SCHEMA = '${this.schemaName}'
                 AND COLUMN_NAME = '${this.columnName}')
    BEGIN
        ALTER TABLE "${this.schemaName}"."${this.tableName}"
            ADD "${this.columnName}" uniqueidentifier
    END
`,
            );
            await MigrationUtilsService.migrationLog(
                'addCreatedByToJobOrder1707207770292',
                '',
                'S',
                'dry_dock',
                `Add ${this.columnName} column to ${this.tableName} table`,
            );
        } catch (e) {
            await MigrationUtilsService.migrationLog(
                'addCreatedByToJobOrder1707207770292',
                errorLikeToString(e),
                'S',
                'dry_dock',
                `Add ${this.columnName} column to ${this.tableName} table`,
                true,
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
