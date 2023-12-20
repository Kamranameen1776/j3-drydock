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
                
                CREATE TABLE [dry_dock].[specification_details_LIB_Survey_CertificateAuthority](
                    [uid] [uniqueidentifier] NOT NULL,
                    [specification_details_uid] [uniqueidentifier] NOT NULL,
                    [LIB_Survey_CertificateAuthority_ID] [int] NOT NULL,
                PRIMARY KEY CLUSTERED 
                (
                    [uid] ASC
                )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
                ) ON [PRIMARY]

                ALTER TABLE [dry_dock].[specification_details_LIB_Survey_CertificateAuthority] ADD  DEFAULT (newid()) FOR [uid]

                ALTER TABLE [dry_dock].[specification_details_LIB_Survey_CertificateAuthority]  WITH CHECK ADD FOREIGN KEY([LIB_Survey_CertificateAuthority_ID])
                REFERENCES [dbo].[LIB_Survey_CertificateAuthority] ([ID])

                ALTER TABLE [dry_dock].[specification_details_LIB_Survey_CertificateAuthority]  WITH CHECK ADD FOREIGN KEY([specification_details_uid])
                REFERENCES [dry_dock].[specification_details] ([uid])
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
