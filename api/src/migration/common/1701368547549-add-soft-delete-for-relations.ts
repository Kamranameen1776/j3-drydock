import { MigrationUtilsService } from 'j2utils';
import { MigrationInterface, QueryRunner } from 'typeorm';

// eslint-disable-next-line @typescript-eslint/naming-convention
export class AddSoftDeleteForRelations1701368547549 implements MigrationInterface {
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
                alter table dry_dock.specification_details_LIB_Survey_CertificateAuthority
                add active_status bit default 1 not null;

                alter table dry_dock.specification_details_j3_pms_agg_job
                add active_status bit default 1 not null;
            `,
            );

            await MigrationUtilsService.migrationLog(
                this.className,
                '',
                'S',
                this.moduleName,
                'AddSoftDeleteForRelations1701368547549',
            );
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                this.className,
                error as string,
                'E',
                this.moduleName,
                'AddSoftDeleteForRelations1701368547549',
                true,
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.query(`
            ALTER TABLE [dry_dock].[specification_details_LIB_Survey_CertificateAuthority]
            DROP COLUMN [active_status];

            ALTER TABLE [dry_dock].[specification_details_j3_pms_agg_job]
            DROP COLUMN [active_status];
        `);

            await MigrationUtilsService.migrationLog(
                this.className,
                '',
                'S',
                this.moduleName,
                'AddSoftDeleteForRelations1701368547549 (Down migration)',
            );
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                this.className,
                error as string,
                'E',
                this.moduleName,
                'AddSoftDeleteForRelations1701368547549 (Down migration)',
                true,
            );
        }
    }
}
