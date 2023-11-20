import { MigrationUtilsService } from 'j2utils';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class createYards1699957353538 implements MigrationInterface {
    tableName = 'yards';
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
                [yard_name] [varchar](400) NULL,
                [yard_location] [varchar](400) NULL,
                [active_status] [bit] NULL,
                [created_by] [uniqueidentifier] NULL,
                [created_at] [datetime] NULL,
                [updated_by] [uniqueidentifier] NULL,
                [updated_at] [datetime] NULL,
                [deleted_by] [uniqueidentifier] NULL,
                [deleted_at] [datetime] NULL,
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
                'createYards1699957353538',
                '',
                'S',
                'dry_dock',
                'Create yards table',
            );
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                'createYards1699957353538',
                JSON.stringify(error),
                'E',
                'dry_dock',
                'Create yards table',
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
            END
            `);

            await MigrationUtilsService.migrationLog(
                'createYards1699957353538',
                '',
                'S',
                'dry_dock',
                'Drop yards table (Down migration)',
            );
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                'createYards1699957353538',
                JSON.stringify(error),
                'E',
                'dry_dock',
                'Drop yards table (Down migration)',
                true,
            );
        }
    }
}
