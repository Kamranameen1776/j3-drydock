import { MigrationInterface, QueryRunner } from 'typeorm';
import { MigrationUtilsService } from 'j2utils';

export class recreateSpecificationDetails1704290466569 implements MigrationInterface {
    tableName = 'specification_details';
    schemaName = 'dry_dock';
    className = this.constructor.name;
    description = 'recreate specification details table';

    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.query(`

            IF NOT EXISTS(select *
              from INFORMATION_SCHEMA.COLUMNS
              where TABLE_NAME = 'specification_details'
                AND TABLE_SCHEMA = 'dry_dock'
                and COLUMN_NAME = 'function')
    BEGIN
        IF EXISTS(Select *
                  from INFORMATION_SCHEMA.TABLES
                  where TABLE_NAME = 'specification_details'
                    AND TABLE_SCHEMA = 'dry_dock')
            BEGIN
                drop table dry_dock.specification_details;
            end
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
    end
`);

            await MigrationUtilsService.migrationLog(this.className, '', 'S', 'dry_dock', this.description);
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                this.className,
                JSON.stringify(error),
                'E',
                'dry_dock',
                this.description,
                true,
            );
        }
    }

    public async down(): Promise<void> {}
}
