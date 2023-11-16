import { MigrationUtilsService } from 'j2utils';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class createStandardJobSurveyCertificateAuthorityTable1698397957294 implements MigrationInterface {
    tableName = 'standard_jobs_survey_certificate_authority';
    schemaName = 'dry_dock';

    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.query(`
            IF NOT EXISTS (Select *
               from INFORMATION_SCHEMA.TABLES
               where TABLE_NAME = '${this.tableName}'
                 AND TABLE_SCHEMA = '${this.schemaName}')
    BEGIN
        CREATE TABLE [${this.schemaName}].[${this.tableName}]
        (
            [standard_job_uid]              [uniqueidentifier] NOT NULL,
            [survey_id]                     [int] NOT NULL,
            PRIMARY KEY ([standard_job_uid],[survey_id])
        ) ON [PRIMARY]
    END`);

            await MigrationUtilsService.migrationLog(
                'createStandardJobSurveyCertificateAuthorityTable1698397957294',
                '',
                'S',
                'dry_dock',
                'Create standard jobs survey certificate authority table',
            );
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                'createStandardJobSurveyCertificateAuthorityTable1698397957294',
                JSON.stringify(error),
                'E',
                'dry_dock',
                'Create standard jobs survey certificate authority table',
                true,
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.query(`
            IF EXISTS (Select * from INFORMATION_SCHEMA.TABLES
                where TABLE_NAME = '${this.tableName}' AND TABLE_SCHEMA = '${this.schemaName}')
            BEGIN
            DROP TABLE [${this.schemaName}].[${this.tableName}]
            END
            `);

            await MigrationUtilsService.migrationLog(
                'createStandardJobSurveyCertificateAuthorityTable1698397957294',
                '',
                'S',
                'dry_dock',
                'Create standard jobs survey certificate authority table (Down migration)',
            );
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                'createStandardJobSurveyCertificateAuthorityTable1698397957294',
                JSON.stringify(error),
                'E',
                'dry_dock',
                'Create standard jobs survey certificate authority table (Down migration)',
                true,
            );
        }
    }
}
