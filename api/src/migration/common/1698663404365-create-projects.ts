import { MigrationUtilsService } from 'j2utils';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class createProjects1698663404365 implements MigrationInterface {
    tableName = 'project';
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
                    [created_at_office] [bit] NOT NULL,
                    [project_state_id] [int] NOT NULL,
                    [subject] [varchar](300) NOT NULL,
                    [project_manager_Uid] [uniqueidentifier] NOT NULL,
                    [start_date] [datetime] NULL,
                    [end_date] [datetime] NULL,
                    [created_at] [datetime2](7) NOT NULL,
                    [active_status] [bit] NOT NULL,
                    [Vessel_Uid] [uniqueidentifier] NULL,
                    [project_type_uid] [uniqueidentifier] NULL,
                    [task_manager_uid] [uniqueidentifier] NULL,
                 CONSTRAINT [pk_project] PRIMARY KEY CLUSTERED 
                (
                    [uid] ASC
                )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
                ) ON [PRIMARY]
                GO
                
                ALTER TABLE [${this.schemaName}].[${this.tableName}] ADD  DEFAULT (newid()) FOR [uid]
                GO
                
                ALTER TABLE [${this.schemaName}].[${this.tableName}] ADD  DEFAULT (getutcdate()) FOR [created_at]
                GO
                
                ALTER TABLE [${this.schemaName}].[${this.tableName}] ADD  DEFAULT ((1)) FOR [active_status]
                GO
                
                ALTER TABLE [${this.schemaName}].[${this.tableName}]  WITH CHECK ADD  CONSTRAINT [FK_project_project_state] FOREIGN KEY([project_state_id])
                REFERENCES [${this.schemaName}].[project_state] ([id])
                GO
                
                ALTER TABLE [${this.schemaName}].[${this.tableName}] CHECK CONSTRAINT [FK_project_project_state]
                GO
                
                ALTER TABLE [${this.schemaName}].[${this.tableName}]  WITH CHECK ADD  CONSTRAINT [FK_project_project_type] FOREIGN KEY([project_type_uid])
                REFERENCES [${this.schemaName}].[project_type] ([uid])
                GO
                
                ALTER TABLE [${this.schemaName}].[${this.tableName}] CHECK CONSTRAINT [FK_project_project_type]
                GO
                
                ALTER TABLE [${this.schemaName}].[${this.tableName}]  WITH CHECK ADD  CONSTRAINT [fk_project_tm_key] FOREIGN KEY([task_manager_uid])
                REFERENCES [dbo].[tec_task_manager] ([uid])
                GO
                
                ALTER TABLE [${this.schemaName}].[${this.tableName}] CHECK CONSTRAINT [fk_project_tm_key]
                GO
                
                
    END`);

            await MigrationUtilsService.migrationLog(
                'createProjects1698663404365',
                '',
                'S',
                'dry_dock',
                'Create project table',
            );
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                'createProjects1698663404365',
                JSON.stringify(error),
                'E',
                'dry_dock',
                'Create project table',
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
                'createProjects1698663404365',
                '',
                'S',
                'dry_dock',
                'Drop project table (Down migration)',
            );
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                'createProjects1698663404365',
                JSON.stringify(error),
                'E',
                'dry_dock',
                'Drop project table (Down migration)',
                true,
            );
        }
    }
}
