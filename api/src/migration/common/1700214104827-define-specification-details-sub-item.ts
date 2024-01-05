import { MigrationUtilsService } from 'j2utils';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class DefineSpecificationDetailsSubItem1700214104827 implements MigrationInterface {
    public readonly name = this.constructor.name;
    public readonly description = 'Define SpecificationDetailsSubItem Entity';

    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.query(`
                if not exists (
                    select top 1
                        *
                    from
                        information_schema.tables
                    where
                        table_schema = 'dry_dock'
                        and
                        table_name = 'specification_details_sub_item'
                )
                begin
                    create table [dry_dock].[specification_details_sub_item] (
                        [uid] [uniqueidentifier]
                            primary key
                            default newid(),
                        [specification_details_uid] [uniqueidentifier]
                            not null,
                        [unit_type_uid] [uniqueidentifier]
                            not null
                            references [dbo].[lib_unit_type] ([uid]),
                        [number] [int]
                            not null
                            identity(1,1), -- autoincrement
                        [subject] [varchar](512)
                            not null,
                        [quantity] [int]
                            not null
                            default 0,
                        [unit_price] [decimal](10,2)
                            not null,
                        [discount] [decimal](5,4)
                            not null default 0,
                        [cost] [decimal](10,4)
                            not null,
                        [active_status] [bit]
                            default 1,
                        [created_at] [datetime]
                            default current_timestamp,
                        [created_by] [uniqueidentifier],
                        [updated_at] [datetime],
                        [updated_by] [uniqueidentifier],
                        [deleted_at] [datetime],
                        [deleted_by] [uniqueidentifier]
                    );
                end;
            `);

            await queryRunner.query(`
                if not exists (
                    select top 1
                        *
                    from
                        sys.indexes
                    where
                        name = 'idx_specification_details_sub_item_subject'
                )
                begin
                    create index [idx_specification_details_sub_item_subject]
                    on
                        [dry_dock].[specification_details_sub_item] ([subject]);
                end;
            `);

            await MigrationUtilsService.migrationLog(this.name, '', 'S', 'dry_dock', this.description);
        } catch (caught) {
            const error = JSON.stringify(caught);

            await MigrationUtilsService.migrationLog(this.name, error, 'E', 'dry_dock', this.description, true);
        }
    }

    public async down(): Promise<void> {}
}
