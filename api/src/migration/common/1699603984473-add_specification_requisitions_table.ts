import { MigrationUtilsService } from 'j2utils';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { errorLikeToString } from '../../common/drydock/ts-helpers/error-like-to-string';

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
            await MigrationUtilsService.migrationLog(
                this.className,
                errorLikeToString(error),
                'E',
                'dry_dock',
                this.description,
                true,
            );
        }
    }

    public async down(): Promise<void> {}
}
