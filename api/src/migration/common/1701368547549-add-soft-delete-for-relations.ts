import { MigrationUtilsService } from 'j2utils';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { errorLikeToString } from "../../common/drydock/ts-helpers/error-like-to-string";

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
    IF EXISTS (Select *
               from INFORMATION_SCHEMA.TABLES
               where TABLE_NAME = 'specification_details_LIB_Survey_CertificateAuthority'
                 AND TABLE_SCHEMA = 'dry_dock')
    BEGIN
                alter table dry_dock.specification_details_LIB_Survey_CertificateAuthority
                add active_status bit default 1 not null;
    END

    IF EXISTS (Select *
               from INFORMATION_SCHEMA.TABLES
               where TABLE_NAME = 'specification_details_j3_pms_agg_job'
                 AND TABLE_SCHEMA = 'dry_dock')
    BEGIN
                alter table dry_dock.specification_details_j3_pms_agg_job
                add active_status bit default 1 not null;
    END
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
                errorLikeToString(error),
                'E',
                this.moduleName,
                'AddSoftDeleteForRelations1701368547549',
                true,
            );
        }
    }

    public async down(): Promise<void> {}
}
