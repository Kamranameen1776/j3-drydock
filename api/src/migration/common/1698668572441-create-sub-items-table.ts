import { MigrationUtilsService } from 'j2utils';
import { MigrationInterface, QueryRunner } from 'typeorm';

// eslint-disable-next-line @typescript-eslint/naming-convention
export class createSubItemsTable1698668572441 implements MigrationInterface {
    tableName = 'standard_jobs_sub_items';
    schemaName = 'dry_dock';

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
            [standard_job_uid]              [uniqueidentifier] NOT NULL,
            [uid]                           [uniqueidentifier] NOT NULL DEFAULT NEWID(),
            [number]                        [int]              NOT NULL IDENTITY(1,1),
            [code]                          [varchar](250)     NULL,
            [subject]                       [varchar](500)     NULL,
            [description]                   [varchar](5000)    NULL,
            [active_status]                 [bit]              NOT NULL DEFAULT 1,
            [created_by]                    [uniqueidentifier] NULL,
            [created_at]                    [datetime]         NOT NULL DEFAULT CURRENT_TIMESTAMP,
            [updated_by]                    [uniqueidentifier] NULL,
            [updated_at]                    [datetime]         NULL,
            [deleted_by]                    [uniqueidentifier] NULL,
            [deleted_at]                    [datetime]         NULL,
             PRIMARY KEY CLUSTERED ([uid] ASC)
        ) ON [PRIMARY]
    END`);

            await MigrationUtilsService.migrationLog(
                'createSubItemsTable1698668572441',
                '',
                'S',
                'dry_dock',
                'Create standard jobs sub items table',
            );
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                'createSubItemsTable1698668572441',
                JSON.stringify(error),
                'E',
                'dry_dock',
                'Create standard jobs sub items table',
                true,
            );
        }
    }

    public async down(): Promise<void> {}
}
