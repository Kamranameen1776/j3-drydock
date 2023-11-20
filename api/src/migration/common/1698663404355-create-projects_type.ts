import { MigrationUtilsService } from 'j2utils';
import { MigrationInterface, QueryRunner } from 'typeorm';

// eslint-disable-next-line @typescript-eslint/naming-convention
export class createProjectsType1698663404355 implements MigrationInterface {
    tableName = 'project_type';
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
                    [Worklist_Type] [varchar](50) NOT NULL,
                    [short_code] [varchar](50) NOT NULL,
                    [created_at] [datetime2](7) NOT NULL,
                    [active_status] [bit] NOT NULL,
                    [uid] [uniqueidentifier] NOT NULL,
                 CONSTRAINT [pk_project_type] PRIMARY KEY CLUSTERED 
                (
                    [uid] ASC
                )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
                UNIQUE NONCLUSTERED 
                (
                    [Worklist_Type] ASC
                )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
                 CONSTRAINT [UQ_uid] UNIQUE NONCLUSTERED 
                (
                    [uid] ASC
                )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
                ) ON [PRIMARY]
                GO
                
                ALTER TABLE [${this.schemaName}].[${this.tableName}] ADD  DEFAULT (getutcdate()) FOR [created_at]
                GO
                
                ALTER TABLE [${this.schemaName}].[${this.tableName}] ADD  DEFAULT ((1)) FOR [active_status]
                GO
                
                ALTER TABLE [${this.schemaName}].[${this.tableName}] ADD  DEFAULT (newid()) FOR [uid]
                GO

                
    END`);

            await MigrationUtilsService.migrationLog(
                'createProjectsType1698663404355',
                '',
                'S',
                'dry_dock',
                'Create project type table',
            );
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                'createProjectsType1698663404355',
                JSON.stringify(error),
                'E',
                'dry_dock',
                'Create project type table',
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
                'createProjectsType1698663404355',
                '',
                'S',
                'dry_dock',
                'Drop project type table (Down migration)',
            );
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                'createProjectsType1698663404355',
                JSON.stringify(error),
                'E',
                'dry_dock',
                'Drop project type table (Down migration)',
                true,
            );
        }
    }
}
