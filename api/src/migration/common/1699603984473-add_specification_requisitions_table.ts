import { MigrationInterface, QueryRunner } from 'typeorm';
import { MigrationUtilsService } from 'j2utils';

export class addSpecificationRequisitionsTable1699603984473 implements MigrationInterface {
    tableName = 'specification_requisitions';
    schemaName = 'dry_dock';
    className = this.constructor.name;
    description = 'Create specification requisitions table';

    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.query(`
            IF NOT EXISTS (Select *
               from INFORMATION_SCHEMA.TABLES
               where TABLE_NAME = '${this.tableName}'
                 AND TABLE_SCHEMA = '${this.schemaName}')
    BEGIN
        CREATE TABLE [${this.schemaName}].[${this.tableName}]
        (
            [specification_uid]              [uniqueidentifier] NOT NULL,
            [requisition_uid]                [uniqueidentifier] NOT NULL,
            PRIMARY KEY ([specification_uid],[requisition_uid])
        ) ON [PRIMARY]
    END`);

            await MigrationUtilsService.migrationLog(this.className, '', 'S', 'dry_dock', this.description);
        } catch (error) {
            await MigrationUtilsService.migrationLog(this.className, error, 'E', 'dry_dock', this.description, true);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
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
                'dry_dock',
                `${this.description} (Down migration)`,
            );
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                this.className,
                error,
                'E',
                'dry_dock',
                `${this.description} (Down migration)`,
                true,
            );
        }
    }
}
