import { MigrationUtilsService } from 'j2utils';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class createStandardJobs1696484959388 implements MigrationInterface {
    tableName = 'standard_jobs';
    schemaName = 'drydock';

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
            [uid]                  [uniqueidentifier] NOT NULL DEFAULT NEWID(),
            [subject]              [varchar](250)     NULL,
            [function]             [varchar](250)     NULL,
            [code]                 [varchar](250)     NULL,
            [category]             [varchar](250)     NULL,
            [inspection]           [varchar](250)     NULL,
            [material_supplied_by] [varchar](250)     NULL,
            [done_by]              [datetime]         NULL,
            [vessel_type_specific] [bit]              NULL,
            [vessel_type_uid]      [uniqueidentifier] NULL,
            [description]          [varchar](5000)    NULL,

            [active_status]        [bit]              NULL DEFAULT 1,
            [created_by]           [uniqueidentifier] NULL,
            [created_at]           [datetime]         NULL DEFAULT CURRENT_TIMESTAMP,
            [updated_by]           [uniqueidentifier] NULL,
            [updated_at]           [datetime]         NULL,
            [deleted_by]           [uniqueidentifier] NULL,
            [deleted_at]           [datetime]         NULL,
            PRIMARY KEY CLUSTERED
                (
                 [uid] ASC
                    )

        ) ON [PRIMARY]
    END`);

            await MigrationUtilsService.migrationLog(
                'createStandardJobs1696484959388',
                '',
                'S',
                'dry_dock',
                'Create standard jobs table',
            );
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                'createStandardJobs1696484959388',
                error,
                'E',
                'dry_dock',
                'Create standard jobs table',
                true,
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.query(`
            IF EXISTS (Select * from INFORMATION_SCHEMA.TABLES
                where TABLE_NAME = '${this.tableName}' AND TABLE_SCHEMA = '${this.schemaName}')
            BEGIN
            DROP TABLE [${this.schemaName}].[${this.tableName}]
            `);

            await MigrationUtilsService.migrationLog(
                'createStandardJobs1696484959388',
                '',
                'S',
                'dry_dock',
                'Drop standard jobs table (Down migration)',
            );
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                'createStandardJobs1696484959388',
                error,
                'E',
                'dry_dock',
                'Drop standard jobs table (Down migration)',
                true,
            );
        }
    }
}
