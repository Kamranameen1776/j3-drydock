import { MigrationInterface, QueryRunner } from 'typeorm';

export class addCreatedByToJobOrder1707207770292 implements MigrationInterface {
    schemaName = 'dry_dock';
    tableName = 'job_orders';
    columnName = 'created_by';

    public async up(queryRunner: QueryRunner): Promise<void> {
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
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
