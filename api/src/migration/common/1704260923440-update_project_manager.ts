import { MigrationInterface, QueryRunner } from 'typeorm';
import { MigrationUtilsService } from 'j2utils';

export class updateProjectManager1704260923440 implements MigrationInterface {
    public readonly name = this.constructor.name;
    protected readonly description = 'Set Project Manager as optional';
    tableName = 'project';
    schemaName = 'dry_dock';

    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.query(`
            IF EXISTS (Select *
               from INFORMATION_SCHEMA.TABLES
               where TABLE_NAME = '${this.tableName}'
                 AND TABLE_SCHEMA = '${this.schemaName}')

            BEGIN
                ALTER TABLE  [dry_dock].[project] ALTER column project_manager_Uid uniqueidentifier NULL;
            END`);

            await MigrationUtilsService.migrationLog(
                this.name,
                '',
                'S',
                'dry_dock',
                this.description,
            );
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                this.name,
                JSON.stringify(error),
                'E',
                'dry_dock',
                this.description,
                true,
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
