import { MigrationInterface, QueryRunner } from 'typeorm';
import { MigrationUtilsService } from 'j2utils';
import { errorLikeToString } from '../../common/drydock/ts-helpers/error-like-to-string';

export class updateStandardJobsCode1709812985901 implements MigrationInterface {
    className: string = this.constructor.name;
    moduleName: string = 'project';

    public async up(queryRunner: QueryRunner): Promise<void> {
        const message = `Update number & code in standard_jobs`;

        try {
            await queryRunner.query(`
                declare @i int  = 10001
                update [dry_dock].[standard_jobs]
                set number  = @i,
                code = 'SJ-' +  CAST(@i AS VARCHAR(16)),
                @i = @i + 1
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
