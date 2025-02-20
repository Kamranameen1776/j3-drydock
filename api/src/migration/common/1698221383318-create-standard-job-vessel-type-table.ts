import { MigrationUtilsService } from 'j2utils';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { errorLikeToString } from '../../common/drydock/ts-helpers/error-like-to-string';

// eslint-disable-next-line @typescript-eslint/naming-convention
export class createStandardJobVesselTypeTable1698221383318 implements MigrationInterface {
    tableName = 'standard_jobs_vessel_type';
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
            [vessel_type_id]                [int] NOT NULL,
            PRIMARY KEY ([standard_job_uid],[vessel_type_id])
        ) ON [PRIMARY]
    END`);

            await MigrationUtilsService.migrationLog(
                'createStandardJobVesselTypeTable1698221383318',
                '',
                'S',
                'dry_dock',
                'Create standard jobs vessel type table',
            );
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                'createStandardJobVesselTypeTable1698221383318',
                errorLikeToString(error),
                'E',
                'dry_dock',
                'Create standard jobs vessel type table',
                true,
            );
        }
    }

    public async down(): Promise<void> {}
}
