import { MigrationUtilsService } from 'j2utils';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class createSpecification_details_j3_pms_agg_job1700489277478 implements MigrationInterface {
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
                IF NOT Exists(SELECT 1 FROM sys.objects WHERE object_id = OBJECT_ID(N'[dry_dock].[specification_details_j3_pms_agg_job]') AND type in (N'U'))
                BEGIN


                CREATE TABLE [dry_dock].[specification_details_j3_pms_agg_job](
                    [uid] [uniqueidentifier] NOT NULL,
                    [specification_uid] [uniqueidentifier] NULL,
                    [j3_pms_agg_job_uid] [uniqueidentifier] NULL,
                PRIMARY KEY CLUSTERED 
                (
                    [uid] ASC
                )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
                ) ON [PRIMARY]
                GO
                
                ALTER TABLE [dry_dock].[specification_details_j3_pms_agg_job] ADD  DEFAULT (newid()) FOR [uid]
                GO
                



                END      
            `,
            );

            await MigrationUtilsService.migrationLog(
                this.className,
                '',
                'S',
                this.moduleName,
                'Create table specification_details_j3_pms_agg_job',
            );
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                this.className,
                error as string,
                'E',
                this.moduleName,
                'Create table specification_details_j3_pms_agg_job',
                true,
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.query(`
            IF Exists(SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dry_dock].[specification_details_j3_pms_agg_job]') AND type in (N'U'))
            BEGIN
                DROP TABLE [dry_dock].[specification_details_j3_pms_agg_job];
            END
            `);

            await MigrationUtilsService.migrationLog(
                this.className,
                '',
                'S',
                this.moduleName,
                'Create table specification_details_j3_pms_agg_job (Down migration)',
            );
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                this.className,
                error as string,
                'E',
                this.moduleName,
                'Create table specification_details_j3_pms_agg_job (Down migration)',
                true,
            );
        }
    }
}
