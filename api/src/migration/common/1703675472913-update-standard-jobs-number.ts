import { MigrationInterface, QueryRunner } from 'typeorm';
import { MigrationUtilsService } from 'j2utils';
import { errorLikeToString } from '../../common/drydock/ts-helpers/error-like-to-string';

export class updateStandardJobsNumber1703675472913 implements MigrationInterface {
    public readonly name = this.constructor.name;
    public readonly description = 'Update Standard Jobs - Number';
    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.query(`
                if exists (
                    select top 1
                        *
                    from
                        information_schema.tables
                    where
                        table_schema = 'dry_dock'
                        and
                        table_name = 'standard_jobs'
                )
                begin
                ALTER TABLE [dry_dock].[standard_jobs]
                DROP COLUMN [number];

                ALTER TABLE [dry_dock].[standard_jobs]
                ADD [number] [int] NOT NULL DEFAULT 1000;
                end;
            `);

            await MigrationUtilsService.migrationLog(this.name, '', 'S', 'dry_dock', this.description);
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                this.name,
                errorLikeToString(error),
                'E',
                'dry_dock',
                this.description,
                true,
            );
        }
    }

    public async down(): Promise<void> {}
}
