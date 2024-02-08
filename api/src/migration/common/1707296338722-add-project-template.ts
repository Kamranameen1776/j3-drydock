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
                [uid] [uniqueidentifier] NOT NULL DEFAULT NEWSEQUENTIALID(),
                [template_code] [int] IDENTITY(1,1) NOT NULL,
                [project_type_uid] [uniqueidentifier] NOT NULL,
                [vessel_type_uid] [uniqueidentifier] NULL,
                [subject] [nvarchar](200) NOT NULL,
                [description] [nvarchar](max) NULL,
                [last_updated] [datetimeoffset](7) NOT NULL,
                [created_at] [datetimeoffset](7) NOT NULL,
                [active_status] [int] NOT NULL DEFAULT(1),
             CONSTRAINT [PK_project_template] PRIMARY KEY CLUSTERED
            (
                [uid] ASC
            ))


            CREATE TABLE [dry_dock].[project_template_standard_job](
                [uid] [uniqueidentifier] NOT NULL DEFAULT NEWSEQUENTIALID(),
                [project_template_uid] [uniqueidentifier] NOT NULL,
                [standard_job_uid] [uniqueidentifier] NOT NULL,
                [created_at] [datetimeoffset](7) NOT NULL,
                [active_status] [int] NOT NULL DEFAULT(1),
             CONSTRAINT [PK_project_template_standard_job] PRIMARY KEY CLUSTERED
            (
                [uid] ASC
            ));



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
