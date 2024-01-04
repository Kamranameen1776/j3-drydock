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
                create table dry_dock.specification_details
                (
                    uid                      uniqueidentifier
                        constraint DF_specification_details_uid default newid() not null
                        constraint pk_specification_details_uid
                            primary key,
                    tec_task_manager_uid     uniqueidentifier,
                    function_uid             uniqueidentifier                   not null,
                    component_uid            uniqueidentifier,
                    account_code             varchar(200),
                    item_source_uid          uniqueidentifier,
                    item_number              varchar(200),
                    done_by_uid              uniqueidentifier,
                    item_category_uid        uniqueidentifier,
                    inspection_uid           uniqueidentifier,
                    equipment_description    varchar(200),
                    priority_uid             uniqueidentifier,
                    description              varchar(1000)                      not null,
                    start_date               datetimeoffset,
                    estimated_days           int,
                    buffer_time              int,
                    treatment                varchar(200),
                    onboard_location_uid     uniqueidentifier,
                    access                   varchar(200),
                    material_supplied_by_uid uniqueidentifier,
                    test_criteria            varchar(200),
                    ppe                      varchar(max),
                    safety_instruction       varchar(max),
                    active_status            bit            default 1           not null,
                    created_by               uniqueidentifier,
                    created_at               datetimeoffset default getutcdate(),
                    subject                  varchar(350),
                    project_uid              uniqueidentifier,
                    [function]               varchar(250),
                    end_date                 datetimeoffset
                );
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

    public async down(): Promise<void> {}
}
