import { MigrationUtilsService } from 'j2utils';
import { MigrationInterface, QueryRunner } from 'typeorm';

// eslint-disable-next-line @typescript-eslint/naming-convention
export class createSpecification_details_LIB_Survey_CertificateAuthority1699958461849 implements MigrationInterface {
    /**
     * @description Create table script of 'specification_details'
     * Purpose          : This is a table for storing specification details
     * Environments     : All
     * Clients          : All
     */
    public className = this.constructor.name;
    public moduleName = 'dry_dock';
    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.query(
                `
                IF NOT Exists(SELECT 1 FROM sys.objects WHERE object_id = OBJECT_ID(N'[dry_dock].[specification_details_LIB_Survey_CertificateAuthority]') AND type in (N'U'))
                BEGIN

                create table specification_details_LIB_Survey_CertificateAuthority
                (
                    uid                                uniqueidentifier default newid() not null
                        primary key,
                    specification_details_uid          uniqueidentifier                 not null,
                    LIB_Survey_CertificateAuthority_ID int                              not null,
                    active_status                      bit              default 1       not null
                );

                END
            `,
            );

            await MigrationUtilsService.migrationLog(
                this.className,
                '',
                'S',
                this.moduleName,
                'Create table specification_details_LIB_Survey_CertificateAuthority',
            );
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                this.className,
                error as string,
                'E',
                this.moduleName,
                'Create table specification_details_LIB_Survey_CertificateAuthority',
                true,
            );
        }
    }

    public async down(): Promise<void> {}
}
