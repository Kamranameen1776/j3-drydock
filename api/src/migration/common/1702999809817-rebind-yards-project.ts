import { MigrationUtilsService } from 'j2utils';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { errorLikeToString } from '../../common/drydock/ts-helpers/error-like-to-string';

export class rebindYardsProject1702999809817 implements MigrationInterface {
    public readonly name = this.constructor.name;
    public readonly description = 'Rebind yards projects';

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
                        table_name = 'yards'
                )
                begin
                   drop table [dry_dock].[yards];
                   truncate table [dry_dock].[yards_projects];
                   alter table [dry_dock].[yards_projects] alter column [yard_uid] [uniqueidentifier] NULL;
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

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
