/* eslint-disable @typescript-eslint/no-empty-function */
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
    public moduleName = 'drydock';
    public functionName = 'Create table "specification_details"';
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
                    [item_source] [varchar](200),
                    [item_number] [varchar](200),
                    [done_by] [varchar](200),
                    [item_category] [varchar](max),
                    [inspection] [varchar](100),
                    [equipment_description] [varchar](200),
                    [priority] [int],
                    [description] [varchar](max),
                    [scope] [varchar](max),
                    [unit] [varchar](max),
                    [quantity] [varchar](max),
                    [unit_price] [varchar](max),
                    [discount] [varchar](max),
                    [cost] [int],
                    [start_date] [datetimeoffset],
                    [estimated_dates] [int],
                    [buffer_time] [int],
                    [treatment] [varchar](200),
                    [onboard_location] [varchar](max),
                    [access] [varchar](200),
                    [material_supplied_by] [varchar](max),
                    [test_criteria] [varchar](200),
                    [ppe] [varchar](max),
                    [safety_instruction] [varchar](max),
                    [active_status] [bit]  DEFAULT ((1)) ,
                    [date_of_creation] [datetimeoffset] DEFAULT (getdate()),
                    [craeted_by] [uniqueidentifier],
                    [date_of_modification] [datetimeoffset],
                    [modified_by] [uniqueidentifier],
                    CONSTRAINT [pk_specification_details_uid] PRIMARY KEY ( [uid] )
                )
                END
            `,
            );

            await MigrationUtilsService.migrationLog(this.className, '', 'S', this.moduleName, this.functionName);
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                this.className,
                error as string,
                'E',
                this.moduleName,
                this.functionName,
                true,
            );
        }
    }

    public async down(): Promise<void> {
        // No need to drop schema
    }
}
