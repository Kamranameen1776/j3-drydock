import { MigrationUtilsService } from 'j2utils';
import { MigrationInterface, QueryRunner } from 'typeorm';

// eslint-disable-next-line @typescript-eslint/naming-convention
export class UpdateSpecificationDetailsTable1700563060567 implements MigrationInterface {
    /**
     * @description Populate INF_Lib_Function table with parent_function_code and parent_module_code
     * Environments     : All
     * Clients          : All
     */
    public className = this.constructor.name;
    public moduleName = 'project';
    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.query(
                `
                ALTER TABLE [dry_dock].[specification_details]
                ADD function_text VARCHAR(1000);

                UPDATE [dry_dock].[specification_details]
                SET [function_text] = 'qwerty'
            `,
            );

            await MigrationUtilsService.migrationLog(
                this.className,
                '',
                'S',
                this.moduleName,
                'Add Column to specification_details',
            );
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                this.className,
                error as string,
                'E',
                this.moduleName,
                'Add Column to specification_details',
                true,
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.query(`
        
            ALTER TABLE [dry_dock].[specification_details]
            DROP COLUMN function_text;
        `);

            await MigrationUtilsService.migrationLog(
                this.className,
                '',
                'S',
                this.moduleName,
                'Add Column to specification_details (Down migration)',
            );
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                this.className,
                error as string,
                'E',
                this.moduleName,
                'Add Column to specification_details (Down migration)',
                true,
            );
        }
    }
}
