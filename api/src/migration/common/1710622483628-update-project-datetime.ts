import { MigrationUtilsService } from 'j2utils';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { errorLikeToString } from '../../common/drydock/ts-helpers/error-like-to-string';

export class UpdateProjectDatetime1710622483628 implements MigrationInterface {
    className: string = this.constructor.name;
    moduleName: string = 'project';

    public async up(queryRunner: QueryRunner): Promise<void> {
        const message = `Update project datetime fields to datetimeoffset`;

        try {
            await queryRunner.query(`

            ALTER TABLE [dry_dock].[project]
            ALTER COLUMN [start_date] datetimeoffset NULL;

            ALTER TABLE [dry_dock].[project]
            ALTER COLUMN [end_date] datetimeoffset NULL;

            ALTER TABLE [dry_dock].[project]
            ALTER COLUMN [created_at] datetimeoffset NOT NULL;

        `);
            await MigrationUtilsService.migrationLog(this.className, '', 'S', this.moduleName, message);
        } catch (e) {
            await MigrationUtilsService.migrationLog(
                this.className,
                errorLikeToString(e),
                'E',
                this.moduleName,
                message,
                true,
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
