import { MigrationUtilsService } from 'j2utils';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class createProjectsState1698663404359 implements MigrationInterface {
    tableName = 'project_state';
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
                    [id] [int] IDENTITY(1,1) NOT NULL,
                    [project_state_name] [varchar](250) NOT NULL,
                    [created_at] [datetime2](7) NOT NULL,
                    [active_status] [bit] NOT NULL,
                    [project_type_uid] [uniqueidentifier] NULL,
                 CONSTRAINT [pk_project_state] PRIMARY KEY CLUSTERED 
                (
                    [id] ASC
                )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
                ) ON [PRIMARY]
                GO
                
                ALTER TABLE [${this.schemaName}].[${this.tableName}] ADD  DEFAULT (getutcdate()) FOR [created_at]
                GO
                
                ALTER TABLE [${this.schemaName}].[${this.tableName}] ADD  DEFAULT ((1)) FOR [active_status]
                GO
                
                ALTER TABLE [${this.schemaName}].[${this.tableName}]  WITH CHECK ADD  CONSTRAINT [FK_project_type] FOREIGN KEY([project_type_uid])
                REFERENCES [${this.schemaName}].[project_type] ([uid])
                GO
                
                ALTER TABLE [${this.schemaName}].[${this.tableName}] CHECK CONSTRAINT [FK_project_type]
                GO
                
    END`);

            await MigrationUtilsService.migrationLog(
                'createProjectsState1698663404359',
                '',
                'S',
                'dry_dock',
                'Create project state table',
            );
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                'createProjectsState1698663404359',
                JSON.stringify(error),
                'E',
                'dry_dock',
                'Create project state table',
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
                'createProjectsState1698663404359',
                '',
                'S',
                'dry_dock',
                'Drop project state table (Down migration)',
            );
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                'createProjectsState1698663404359',
                JSON.stringify(error),
                'E',
                'dry_dock',
                'Drop project state table (Down migration)',
                true,
            );
        }
    }
}
