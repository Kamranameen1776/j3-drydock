import { MigrationInterface, QueryRunner } from 'typeorm';
import { MigrationUtilsService } from 'j2utils';

export class addSpecificationSubItemFindingTable1702982902772 implements MigrationInterface {
    public className = this.constructor.name;
    public schemaName = 'dry_dock';
    public tableName = 'specification_sub_item_finding';
    public description = 'Create specification sub item finding table';

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
            [finding_uid]                [uniqueidentifier] NOT NULL,
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
                error as string,
                'E',
                this.schemaName,
                this.description,
                true,
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.query(`
            IF EXISTS (Select * from INFORMATION_SCHEMA.TABLES
                where TABLE_NAME = '${this.tableName}' AND TABLE_SCHEMA = '${this.schemaName}')
            BEGIN
            DROP TABLE [${this.schemaName}].[${this.tableName}]
            END
            `);

            await MigrationUtilsService.migrationLog(
                this.className,
                '',
                'S',
                'dry_dock',
                `${this.description} (Down migration)`,
            );
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                this.className,
                JSON.stringify(error),
                'E',
                'dry_dock',
                `${this.description} (Down migration)`,
                true,
            );
        }
    }
}
