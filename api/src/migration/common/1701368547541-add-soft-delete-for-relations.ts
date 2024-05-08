import { MigrationUtilsService } from 'j2utils';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { errorLikeToString } from '../../common/drydock/ts-helpers/error-like-to-string';

// eslint-disable-next-line @typescript-eslint/naming-convention
export class AddSoftDeleteForRelations1701368547541 implements MigrationInterface {
    /**
     * @description Populate INF_Lib_Function table with parent_function_code and parent_module_code
     * Environments     : All
     * Clients          : All
     */
    public className = this.constructor.name;
    public moduleName = 'project';
    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.query(`
            IF NOT EXISTS (
                SELECT 1
                FROM INFORMATION_SCHEMA.COLUMNS
                WHERE TABLE_SCHEMA = 'dry_dock'
                AND TABLE_NAME = 'specification_details_LIB_Survey_CertificateAuthority'
                AND COLUMN_NAME = 'active_status'
            )
            BEGIN
                ALTER TABLE dry_dock.specification_details_LIB_Survey_CertificateAuthority
                ADD active_status bit DEFAULT 1 NOT NULL;
            END
            `);

            await queryRunner.query(`
            IF NOT EXISTS (
                SELECT 1
                FROM INFORMATION_SCHEMA.COLUMNS
                WHERE TABLE_SCHEMA = 'dry_dock'
                AND TABLE_NAME = 'specification_details_j3_pms_agg_job'
                AND COLUMN_NAME = 'active_status'
            )
                BEGIN
                            alter table dry_dock.specification_details_j3_pms_agg_job
                            add active_status bit default 1 not null;
                END
            `);

            await MigrationUtilsService.migrationLog(
                this.className,
                '',
                'S',
                this.moduleName,
                'AddSoftDeleteForRelations1701368547541',
            );
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                this.className,
                errorLikeToString(error),
                'E',
                this.moduleName,
                'AddSoftDeleteForRelations1701368547541',
                true,
            );
        }
    }

    public async down(): Promise<void> {}
}
