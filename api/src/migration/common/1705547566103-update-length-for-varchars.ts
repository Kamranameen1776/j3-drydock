import { MigrationInterface, QueryRunner } from 'typeorm';
import { MigrationUtilsService } from 'j2utils';
import { errorLikeToString } from "../../common/drydock/ts-helpers/error-like-to-string";

export class updateLengthForVarchars1705547566103 implements MigrationInterface {
    schemaName = 'dry_dock';
    className = this.constructor.name;
    moduleName = 'dry_dock';
    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.query(`
            BEGIN
                alter table dry_dock.specification_details_sub_item alter column description varchar(8000);
                alter table dry_dock.standard_jobs alter column description varchar(8000);
                alter table dry_dock.standard_jobs alter column scope varchar(8000);
                alter table dry_dock.standard_jobs_sub_items alter column description varchar(8000);
                alter table dry_dock.job_orders alter column remarks varchar(8000);
                alter table dry_dock.daily_reports alter column body varchar(8000);
            END
            `);

            await MigrationUtilsService.migrationLog(
                this.className,
                '',
                'S',
                this.moduleName,
                `Update length for varchars`,
            );
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                this.className,
                errorLikeToString(error),
                'E',
                this.moduleName,
                `Update length for varchars`,
                true,
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
