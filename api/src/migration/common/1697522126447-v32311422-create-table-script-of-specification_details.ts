import { MigrationUtilsService } from 'j2utils';
import { MigrationInterface, QueryRunner } from 'typeorm';

// eslint-disable-next-line @typescript-eslint/naming-convention
export class v32311422CreateTableScriptOfSpecificationDetails1697522126447 implements MigrationInterface {
    /**
     * @description Create table script of 'specification_details'
     * Purpose          : This is a table for storing specification details
     * Environments     : All
     * Clients          : All
     */
    public className = this.constructor.name;
    public moduleName = 'dry_dock';
    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.query(
                `
                IF NOT Exists(SELECT 1 FROM sys.objects WHERE object_id = OBJECT_ID(N'[dry_dock].[specification_details]') AND type in (N'U'))
                BEGIN
                CREATE TABLE [dry_dock].[specification_details](
                    [uid] [uniqueidentifier] NOT NULL,
                    [tec_task_manager_uid] [uniqueidentifier] NULL,
                    [function_uid] [uniqueidentifier] NOT NULL,
                    [component_uid] [uniqueidentifier] NULL,
                    [account_code] [varchar](200) NULL,
                    [item_source_uid] [uniqueidentifier] NULL,
                    [item_number] [varchar](200) NULL,
                    [done_by_uid] [uniqueidentifier] NULL,
                    [item_category_uid] [uniqueidentifier] NULL,
                    [inspection_uid] [uniqueidentifier] NULL,
                    [equipment_description] [varchar](200) NULL,
                    [priority_uid] [uniqueidentifier] NULL,
                    [description] [varchar](1000) NOT NULL,
                    [start_date] [datetime2](7) NULL,
                    [estimated_days] [int] NULL,
                    [buffer_time] [int] NULL,
                    [treatment] [varchar](200) NULL,
                    [onboard_location_uid] [uniqueidentifier] NULL,
                    [access] [varchar](200) NULL,
                    [material_supplied_by_uid] [uniqueidentifier] NULL,
                    [test_criteria] [varchar](200) NULL,
                    [ppe] [varchar](max) NULL,
                    [safety_instruction] [varchar](max) NULL,
                    [active_status] [bit] NOT NULL,
                    [created_by] [uniqueidentifier] NULL,
                    [created_at] [datetime2](7) NOT NULL,
                    [subject] [varchar](350) NULL,
                    [project_uid] [uniqueidentifier] NULL,
                 CONSTRAINT [pk_specification_details_uid] PRIMARY KEY CLUSTERED 
                (
                    [uid] ASC
                )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
                ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
                GO
                
                ALTER TABLE [dry_dock].[specification_details] ADD  CONSTRAINT [DF_specification_details_uid]  DEFAULT (newid()) FOR [uid]
                GO
                
                ALTER TABLE [dry_dock].[specification_details] ADD  DEFAULT ((1)) FOR [active_status]
                GO
                
                ALTER TABLE [dry_dock].[specification_details] ADD  DEFAULT (getutcdate()) FOR [created_at]
                GO
                END      
            `,
            );

            await MigrationUtilsService.migrationLog(
                this.className,
                '',
                'S',
                this.moduleName,
                'Create table specification_details',
            );
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                this.className,
                error as string,
                'E',
                this.moduleName,
                'Create table specification_details',
                true,
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.query(`
            IF Exists(SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dry_dock].[specification_details]') AND type in (N'U'))
            BEGIN
                DROP TABLE [dry_dock].[specification_details];
            END
            `);

            await MigrationUtilsService.migrationLog(
                this.className,
                '',
                'S',
                this.moduleName,
                'Create table specification_details (Down migration)',
            );
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                this.className,
                error as string,
                'E',
                this.moduleName,
                'Create table specification_details (Down migration)',
                true,
            );
        }
    }
}
