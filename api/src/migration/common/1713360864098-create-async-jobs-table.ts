import { MigrationUtilsService } from 'j2utils';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { errorLikeToString } from '../../common/drydock/ts-helpers/error-like-to-string';

export class createAsyncJobsTable1713360864098 implements MigrationInterface {
    className = this.constructor.name;
    moduleName = 'project';
    message = `Create async jobs table`;

    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.query(`
        CREATE TABLE [dry_dock].[async_jobs](
            [uid]                       [uniqueidentifier]  NOT NULL,
            [module_code]               [varchar](50)       NULL,
            [function_code]             [varchar](50)       NOT NULL,
            [topic]                     [varchar](255)      NOT NULL,
            [status_code]               [int]               NULL,
            [modified_at]               [datetimeoffset](7) NOT NULL,
            [modified_by]               [uniqueidentifier]  NOT NULL,
            [active_status]             [int]               NOT NULL DEFAULT(1),
            PRIMARY KEY ([uid])
        ) ON [PRIMARY];
        `);
            await MigrationUtilsService.migrationLog(this.className, '', 'S', this.moduleName, this.message);
        } catch (e) {
            await MigrationUtilsService.migrationLog(
                this.className,
                errorLikeToString(e),
                'E',
                this.moduleName,
                this.message,
                true,
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
