import {MigrationInterface, QueryRunner} from "typeorm";
import { MigrationUtilsService } from "j2utils";

export class updateSpecificationSubItems1701933910453 implements MigrationInterface {
    public readonly name = this.constructor.name;
    public readonly description = 'Update SpecificationDetailsSubItem Entity';

    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.query(`
                if exists (
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
                    alter table dry_dock.specification_details_sub_item
                    alter column unit_type_uid uniqueidentifier NULL;

                    alter table dry_dock.specification_details_sub_item
                    alter column quantity int NULL;

                    alter table dry_dock.specification_details_sub_item
                    alter column unit_price decimal(10,2) NULL;

                    alter table dry_dock.specification_details_sub_item
                    alter column discount decimal(5,4) NULL;

                    alter table dry_dock.specification_details_sub_item
                    alter column cost decimal(10,4) NULL;
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
        } catch (e) {
            const error = JSON.stringify(e);

            await MigrationUtilsService.migrationLog(this.name, error, 'E', 'dry_dock', this.description, true);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.query(`
                if exists (
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
                    alter table dry_dock.specification_details_sub_item
                    alter column unit_type_uid uniqueidentifier NOT NULL;

                    alter table dry_dock.specification_details_sub_item
                    alter column quantity int NULL;

                    alter table dry_dock.specification_details_sub_item
                    alter column unit_price decimal(10,2) NOT NULL;

                    alter table dry_dock.specification_details_sub_item
                    alter column discount decimal(5,4) NOT NULL;

                    alter table dry_dock.specification_details_sub_item
                    alter column cost decimal(10,4) NOT NULL;
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
        } catch (e) {
            const error = JSON.stringify(e);

            await MigrationUtilsService.migrationLog(this.name, error, 'E', 'dry_dock', this.description, true);
        }
    }

}
