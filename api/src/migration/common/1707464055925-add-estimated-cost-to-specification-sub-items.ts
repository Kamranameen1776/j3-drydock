import { MigrationInterface, QueryRunner } from 'typeorm';
import { MigrationUtilsService } from 'j2utils';
import { errorLikeToString } from '../../common/drydock/ts-helpers/error-like-to-string';

export class addEstimatedCostToSpecificationSubItems1707464055925 implements MigrationInterface {
    schemaName = 'dry_dock';
    tableName = 'specification_details_sub_item';
    columnName = 'estimated_cost';

    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.query(`
                IF NOT EXISTS (Select *
               from INFORMATION_SCHEMA.COLUMNS
               where TABLE_NAME = '${this.tableName}'
                 AND TABLE_SCHEMA = '${this.schemaName}'
                 AND COLUMN_NAME = '${this.columnName}')
    BEGIN
        ALTER TABLE "${this.schemaName}"."${this.tableName}"
            ADD "${this.columnName}" decimal(10, 4) NOT NULL DEFAULT 0;
    END
            `);
            await MigrationUtilsService.migrationLog(
                'addEstimatedCostToSpecificationSubItems1707464055925',
                '',
                'S',
                'dry_dock',
                `Add ${this.columnName} column to ${this.tableName} table`,
            );
        } catch (e) {
            await MigrationUtilsService.migrationLog(
                'addEstimatedCostToSpecificationSubItems1707464055925',
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
