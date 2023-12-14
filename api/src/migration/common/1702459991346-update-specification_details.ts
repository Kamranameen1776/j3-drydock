import {MigrationInterface, QueryRunner} from "typeorm";
import { MigrationUtilsService } from "j2utils";

export class updateSpecificationDetails1702459991346 implements MigrationInterface {
    public readonly name = this.constructor.name;
    public readonly description = 'Update Specification_Details Entity';
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
                        table_name = 'specification_details'
                )
                begin
                   alter table dry_dock.specification_details
                        add end_date datetimeoffset
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
                        table_name = 'specification_details'
                )
                begin
                    alter table dry_dock.specification_details
                        drop column end_date

                end;
            `);
            await MigrationUtilsService.migrationLog(this.name, '', 'S', 'dry_dock', this.description);
        } catch (e) {
            const error = JSON.stringify(e);

            await MigrationUtilsService.migrationLog(this.name, error, 'E', 'dry_dock', this.description, true);
        }
    }

}
