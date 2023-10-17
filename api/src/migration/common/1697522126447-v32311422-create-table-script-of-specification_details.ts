import { MigrationUtilsService } from 'j2utils';
import { MigrationInterface, QueryRunner } from 'typeorm';

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
                    [function_uid] [uniqueidentifier],
                    [component_uid] [uniqueidentifier],
                    [account_code] [varchar](200),
                    [item_source] [uniqueidentifier],
                    [item_number] [varchar](200),
                    [done_by] [uniqueidentifier],
                    [item_category] [uniqueidentifier],
                    [inspection] [uniqueidentifier],
                    [equipment_description] [varchar](200),
                    [priority] [uniqueidentifier],
                    [description] [varchar](max),
                    [scope] [varchar](max),
                    [unit] [uniqueidentifier],
                    [quantity] [varchar](max),
                    [unit_price] [varchar](max),
                    [discount] [varchar](max),
                    [cost] [int],
                    [start_date] [datetimeoffset],
                    [estimated_dates] [datetime],
                    [buffer_time] [int],
                    [treatment] [varchar](200),
                    [onboard_location] [varchar](max),
                    [access] [varchar](200),
                    [material_supplied_by] [uniqueidentifier],
                    [test_criteria] [varchar](200),
                    [ppe] [varchar](max),
                    [safety_instruction] [varchar](max),
                    [active_status] [bit] ,
                    [date_of_creation] [datetime],
                    [created_by] [int] NULL,
                    [date_of_modification] [datetime],
                    [modified_by] [int] NULL,
                    CONSTRAINT [pk_specification_details_uid] PRIMARY KEY ( [uid] )
                )
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
