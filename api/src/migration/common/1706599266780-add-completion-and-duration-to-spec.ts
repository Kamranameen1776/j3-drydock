import { MigrationInterface, QueryRunner } from 'typeorm';
import { MigrationUtilsService } from 'j2utils';

export class addCompletionAndDurationToSpec1706599266780 implements MigrationInterface {
    schemaName = 'dry_dock';
    className = this.constructor.name;
    moduleName = 'dry_dock';
    tableName = 'specification_details'
    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.query(`
            IF NOT EXISTS (Select *
               from INFORMATION_SCHEMA.COLUMNS
               where TABLE_NAME = '${this.tableName}'
                 AND TABLE_SCHEMA = '${this.schemaName}'
                 AND COLUMN_NAME = 'Completion' )

            BEGIN
                ALTER TABLE  dry_dock.specification_details
                ADD Completion INT NULL, Duration INT NULL;
            END;
            `);

            await MigrationUtilsService.migrationLog(
                this.className,
                '',
                'S',
                this.moduleName,
                `Add Completion And Duration To Spec`,
            );
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                this.className,
                error as string,
                'E',
                this.moduleName,
                `Add Completion And Duration To Spec`,
                true,
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
