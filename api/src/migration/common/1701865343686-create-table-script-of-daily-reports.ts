import { MigrationUtilsService } from "j2utils";
import {MigrationInterface, QueryRunner} from "typeorm";

export class createTableScriptOfDailyReports1701865343686 implements MigrationInterface {
tableName = 'daily_reports';
schemaName = 'dry_dock';
className = this.constructor.name;
moduleName = 'dry_dock';
public async up(queryRunner: QueryRunner): Promise<void> {
    try {
        await queryRunner.query(`
        IF NOT EXISTS (Select * from INFORMATION_SCHEMA.TABLES where TABLE_NAME = '${this.tableName}' AND TABLE_SCHEMA = '${this.schemaName}')
        BEGIN
        CREATE TABLE [dry_dock].[daily_reports](
            [uid] [uniqueidentifier] NOT NULL,
            [report_name] [varchar](200) NULL,
            [report_date] [datetime2](7) NULL,
            [description] [varchar](max) NULL,
            [active_status] [bit] NOT NULL,
            [created_by] [uniqueidentifier] NULL,
            [created_at] [datetime2](7) NOT NULL,
            [updated_by] [uniqueidentifier] NULL,
            [updated_at] [datetime2](7) NULL,
            [deleted_by] [uniqueidentifier] NULL,
            [deleted_at] [datetime2](7) NULL,
        PRIMARY KEY CLUSTERED 
            (
                [uid] ASC
            )
            ) ON [PRIMARY]            
            ALTER TABLE [${this.schemaName}].[${this.tableName}] ADD  DEFAULT (newid()) FOR [uid]            
            ALTER TABLE [${this.schemaName}].[${this.tableName}] ADD  DEFAULT ((1)) FOR [active_status]            
            ALTER TABLE [${this.schemaName}].[${this.tableName}] ADD  DEFAULT (getdate()) FOR [created_at]
            END
        `);

        await MigrationUtilsService.migrationLog(
            this.className,
            '',
            'S',
            this.moduleName,
            'Create table daily_reports',
        );
    } catch (error) {
        await MigrationUtilsService.migrationLog(
            this.className,
            error as string,
            'E',
            this.moduleName,
            'Create table daily_reports',
            true,
        );
    }
}

public async down(queryRunner: QueryRunner): Promise<void> {}
}

