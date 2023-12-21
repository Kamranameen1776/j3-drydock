import { MigrationUtilsService } from "j2utils";
import {MigrationInterface, QueryRunner} from "typeorm";

export class createTableScriptOfDailyReportUpdates1702553205744 implements MigrationInterface {
    tableName = 'daily_report_updates';
    schemaName = 'dry_dock';
    className = this.constructor.name;
    moduleName = 'dry_dock';
    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.query(`
            IF NOT EXISTS (Select * from INFORMATION_SCHEMA.TABLES where TABLE_NAME '${this.tableName}' AND TABLE_SCHEMA = '${this.schemaName}')
            BEGIN
            CREATE TABLE [${this.schemaName}].[${this.tableName}](
                [uid] [uniqueidentifier] NOT NULL,
                [report_uid] [uniqueidentifier] NOT NULL,
                [report_update_name] [varchar](200) NULL,
                [remark] [varchar](5000) NULL,
                [active_status] [bit] NOT NULL,
                [created_by] [uniqueidentifier] NULL,
                [created_at] [datetimeoffset](7) NOT NULL,
                [updated_by] [uniqueidentifier] NULL,
                [updated_at] [datetimeoffset](7) NULL,
                [deleted_by] [uniqueidentifier] NULL,
                [deleted_at] [datetimeoffset](7) NULL,
            PRIMARY KEY CLUSTERED 
                (
                    [uid] ASC
                )
                ) ON [PRIMARY]            
                ALTER TABLE [${this.schemaName}].[${this.tableName}] ADD  DEFAULT (newid()) FOR [uid]            
                ALTER TABLE [${this.schemaName}].[${this.tableName}] ADD  DEFAULT ((1)) FOR [active_status]            
                ALTER TABLE [${this.schemaName}].[${this.tableName}] ADD  DEFAULT (getutcdate()) FOR [created_at]
                END
            `);
    
            await MigrationUtilsService.migrationLog(
                this.className,
                '',
                'S',
                this.moduleName,
                'Create table daily_report_update',
            );
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                this.className,
                error as string,
                'E',
                this.moduleName,
                'Create table daily_report_update',
                true,
            );
        }
    }
    
    public async down(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.query(`
            IF Exists(SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[${this.schemaName}].[${this.tableName}]') AND type in (N'U'))
            BEGIN
                DROP TABLE [${this.schemaName}].[${this.tableName}];
            END
            `);
    
            await MigrationUtilsService.migrationLog(
                this.className,
                '',
                'S',
                this.moduleName,
                'Create table daily_report_update (Down migration)',
            );
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                this.className,
                error as string,
                'E',
                this.moduleName,
                'Create table daily_report_update (Down migration)',
                true,
            );
        }
    }
    }
    
    
