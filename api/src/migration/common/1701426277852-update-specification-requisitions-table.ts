import { MigrationInterface, QueryRunner } from 'typeorm';
import { MigrationUtilsService } from 'j2utils';

export class updateSpecificationRequisitionsTable1701426277852 implements MigrationInterface {
    tableName = 'specification_requisitions';
    schemaName = 'dry_dock';
    className = this.constructor.name;
    description = 'Update specification requisitions table';

    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.query(`
            IF EXISTS (Select *
               from INFORMATION_SCHEMA.TABLES
               where TABLE_NAME = '${this.tableName}'
                 AND TABLE_SCHEMA = '${this.schemaName}')
            BEGIN
                 drop table dry_dock.specification_requisitions;
            END;

            create table dry_dock.specification_requisitions
            (
                uid               uniqueidentifier default newid() not null
                    primary key,
                specification_uid uniqueidentifier                 not null,
                requisition_uid   uniqueidentifier                 not null,
                active_status     bit              default 1       not null,
            );

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
