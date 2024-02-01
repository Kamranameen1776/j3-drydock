import { MigrationUtilsService } from 'j2utils';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { errorLikeToString } from '../../common/drydock/ts-helpers/error-like-to-string';

export class createYardsProjects1699957368834 implements MigrationInterface {
    tableName = 'yards_projects';
    schemaName = 'dry_dock';

    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.query(`
            IF NOT EXISTS (Select *
               from INFORMATION_SCHEMA.TABLES
               where TABLE_NAME = '${this.tableName}'
                 AND TABLE_SCHEMA = '${this.schemaName}')

            BEGIN
            CREATE TABLE [${this.schemaName}].[${this.tableName}](
                [uid] [uniqueidentifier] NOT NULL,
                [project_uid] [uniqueidentifier] NULL,
                [last_exported_date] [datetime2](7) NULL,
                [is_selected] [bit] NULL,
                [active_status] [bit] NULL,
                [created_by] [uniqueidentifier] NULL,
                [created_at] [datetime] NULL,
                [updated_by] [uniqueidentifier] NULL,
                [updated_at] [datetime] NULL,
                [deleted_by] [uniqueidentifier] NULL,
                [deleted_at] [datetime] NULL,
                [yard_uid] [varchar](400) NULL,
            PRIMARY KEY CLUSTERED
            (
                [uid] ASC
            )
            ) ON [PRIMARY]
            ALTER TABLE [${this.schemaName}].[${this.tableName}] ADD  DEFAULT (newid()) FOR [uid]
            ALTER TABLE [${this.schemaName}].[${this.tableName}] ADD  DEFAULT ((1)) FOR [active_status]
            ALTER TABLE [${this.schemaName}].[${this.tableName}] ADD  DEFAULT (getdate()) FOR [created_at]
            END`);

            await MigrationUtilsService.migrationLog(
                'createYardsProjects1699957368834',
                '',
                'S',
                'dry_dock',
                'Create yards to projects table',
            );
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                'createYardsProjects1699957368834',
                errorLikeToString(error),
                'E',
                'dry_dock',
                'Create yards to projects table',
                true,
            );
        }
    }

    public async down(): Promise<void> {}
}
