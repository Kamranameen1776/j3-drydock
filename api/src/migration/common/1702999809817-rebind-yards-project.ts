import { MigrationUtilsService } from "j2utils";
import {MigrationInterface, QueryRunner} from "typeorm";

export class rebindYardsProject1702999809817 implements MigrationInterface {
    public readonly name = this.constructor.name;
    public readonly description = 'Rebind yards projects';

    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.query(`
                if exists (
                    select top 1
                        *
                    from
                        information_schema.tables
                    where
                        table_schema = 'dry_dock'
                        and
                        table_name = 'yards'
                )
                begin
                   drop table [dry_dock].[yards];
                   truncate table [dry_dock].[yards_projects];
                   alter table [dry_dock].[yards_projects] alter column [yard_uid] [uniqueidentifier] NULL;
                end;
            `);

            await MigrationUtilsService.migrationLog(this.name, '', 'S', 'dry_dock', this.description);
        } catch (e) {
            const error = JSON.stringify(e);

            await MigrationUtilsService.migrationLog(this.name, error, 'E', 'dry_dock', this.description, true);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.query(`IF NOT EXISTS (Select *
                from INFORMATION_SCHEMA.TABLES
                where TABLE_NAME = 'yards'
                  AND TABLE_SCHEMA = 'dry_dock')
            
             BEGIN
             CREATE TABLE [dry_dock].[yards](
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
             ALTER TABLE [dry_dock].[yards] ADD  DEFAULT (newid()) FOR [uid]
             ALTER TABLE [dry_dock].[yards] ADD  DEFAULT ((1)) FOR [active_status]
             ALTER TABLE [dry_dock].[yards] ADD  DEFAULT (getdate()) FOR [created_at]
             END`);
            await MigrationUtilsService.migrationLog(this.name, '', 'S', 'dry_dock', this.description);
        } catch (e) {
            const error = JSON.stringify(e);

            await MigrationUtilsService.migrationLog(this.name, error, 'E', 'dry_dock', this.description, true);
        }
    }

}
