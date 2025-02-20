import {MigrationInterface, QueryRunner} from "typeorm";
import { MigrationUtilsService } from 'j2utils';

export class AppProjectTemplate1707296338722 implements MigrationInterface {
    className: string = this.constructor.name;

    moduleName: string = 'project';

    public async up(queryRunner: QueryRunner): Promise<void> {

        const message = 'Add project template';

        try {
            await queryRunner.query(`
            CREATE TABLE [dry_dock].[project_template](
                [uid]                      [uniqueidentifier]  NOT NULL DEFAULT NEWSEQUENTIALID(),
                [template_code]            [int] IDENTITY(1,1) NOT NULL,
                [project_type_uid]         [uniqueidentifier]  NOT NULL,
                [vessel_type_specific]     [bit]               NULL DEFAULT 0,
                [subject]                  [nvarchar](200)     NOT NULL,
                [description]              [nvarchar](max)     NULL,
                [active_status]            [bit]               NULL DEFAULT 1,
                [created_by]               [uniqueidentifier]  NULL,
                [created_at]               [datetimeoffset](7) NULL DEFAULT CURRENT_TIMESTAMP,
                [updated_by]               [uniqueidentifier]  NULL,
                [updated_at]               [datetimeoffset](7) NULL,
                [deleted_by]               [uniqueidentifier]  NULL,
                [deleted_at]               [datetimeoffset](7) NULL,
                CONSTRAINT [PK_project_template] PRIMARY KEY CLUSTERED (
                    [uid] ASC
                )
            );

            CREATE TABLE [dry_dock].[project_template_standard_job](
                [project_template_uid]      [uniqueidentifier]  NOT NULL,
                [standard_job_uid]          [uniqueidentifier]  NOT NULL,
                [modified_at]               [datetimeoffset](7) NOT NULL,
                [modified_by]               [uniqueidentifier]  NOT NULL,
                [active_status]             [int]               NOT NULL DEFAULT(1),
                CONSTRAINT [PK_project_template_standard_job] PRIMARY KEY CLUSTERED (
                    [project_template_uid],
                    [standard_job_uid]
                )
            ) ON [PRIMARY];

            CREATE TABLE [dry_dock].[project_template_vessel_type]
            (
                [project_template_uid]      [uniqueidentifier]  NOT NULL,
                [vessel_type_id]            [int]               NOT NULL,
                [modified_at]               [datetimeoffset](7) NOT NULL,
                [modified_by]               [uniqueidentifier]  NOT NULL,
                [active_status]             [int]               NOT NULL DEFAULT(1),
                PRIMARY KEY ([project_template_uid],[vessel_type_id])
            ) ON [PRIMARY];
            `);

            await MigrationUtilsService.migrationLog(
                this.className,
                '',
                'S',
                this.moduleName,
                message
            );
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                this.className,
                error as string,
                'E',
                this.moduleName,
                message,
                true,
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
