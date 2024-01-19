import { MigrationInterface, QueryRunner } from 'typeorm';
import { MigrationUtilsService } from 'j2utils';

export class nvarcharmaxLimit1705658261048 implements MigrationInterface {
    schemaName = 'dry_dock';
    className = this.constructor.name;
    moduleName = 'dry_dock';
    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.query(`
            BEGIN
                alter table dry_dock.specification_details alter column description nvarchar(max);
                alter table dry_dock.specification_details_sub_item alter column description nvarchar(max);
                alter table dry_dock.standard_jobs alter column description nvarchar(max);
                alter table dry_dock.standard_jobs alter column scope nvarchar(max);
                alter table dry_dock.standard_jobs_sub_items alter column description nvarchar(max);
                alter table dry_dock.job_orders alter column remarks nvarchar(max);
                alter table dry_dock.daily_reports alter column body nvarchar(max);
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
                error as string,
                'E',
                this.moduleName,
                `Update length for varchars`,
                true,
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
