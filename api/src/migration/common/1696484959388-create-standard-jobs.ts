import { MigrationUtilsService } from 'j2utils';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { errorLikeToString } from '../../common/drydock/ts-helpers/error-like-to-string';

// eslint-disable-next-line @typescript-eslint/naming-convention
export class createStandardJobs1696484959388 implements MigrationInterface {
    tableName = 'standard_jobs';
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
            [uid]                      [uniqueidentifier] NOT NULL DEFAULT NEWID(),
            [subject]                  [varchar](250)     NULL,
            [function]                 [varchar](250)     NULL,
            [function_uid]              [uniqueidentifier] NULL,
            [code]                     [varchar](250)     NULL,
            [number]                   [int]              NOT NULL IDENTITY(1,1),
            [scope]                    [varchar](5000)    NULL,
            [category_uid]             [uniqueidentifier] NULL,
            [material_supplied_by_uid] [uniqueidentifier] NULL,
            [done_by_uid]              [uniqueidentifier] NULL,
            [vessel_type_specific]     [bit]              NULL,
            [description]              [varchar](5000)    NULL,

            [active_status]            [bit]              NULL DEFAULT 1,
            [created_by]               [uniqueidentifier] NULL,
            [created_at]               [datetime]         NULL DEFAULT CURRENT_TIMESTAMP,
            [updated_by]               [uniqueidentifier] NULL,
            [updated_at]               [datetime]         NULL,
            [deleted_by]               [uniqueidentifier] NULL,
            [deleted_at]               [datetime]         NULL,
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
                errorLikeToString(error),
                'E',
                'dry_dock',
                'Create standard jobs table',
                true,
            );
        }
    }

    public async down(): Promise<void> {}
}
