import { MigrationInterface, QueryRunner } from 'typeorm';
import { MigrationUtilsService } from 'j2utils';
import { errorLikeToString } from "../../common/drydock/ts-helpers/error-like-to-string";

export class addSpecificationSubItemPmsJobTable1702972902772 implements MigrationInterface {
    public className = this.constructor.name;
    public schemaName = 'dry_dock';
    public tableName = 'specification_sub_item_j3_pms_agg_job';
    public description = 'Create specification sub item pms job table';

    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.query(
                `
                IF NOT EXISTS (Select *
               from INFORMATION_SCHEMA.TABLES
               where TABLE_NAME = '${this.tableName}'
                 AND TABLE_SCHEMA = '${this.schemaName}')
    BEGIN

        CREATE TABLE [${this.schemaName}].[${this.tableName}]
        (
            [uid]                        [uniqueidentifier] NOT NULL DEFAULT NEWID(),
            [specification_sub_item_uid] [uniqueidentifier] NOT NULL,
            [j3_pms_agg_job_uid]         [uniqueidentifier] NOT NULL,
            [active_status]              [bit] NOT NULL DEFAULT 1,
            PRIMARY KEY CLUSTERED
                (
                 [uid] ASC
                    ) ON [PRIMARY]
        )
    END`,
            );

            await MigrationUtilsService.migrationLog(
                this.className,
                '',
                'S',
                this.schemaName,
                this.description,
            );
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                this.className,
                errorLikeToString(error),
                'E',
                this.schemaName,
                this.description,
                true,
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
