import { MigrationInterface, QueryRunner } from 'typeorm';
import { MigrationUtilsService } from 'j2utils';
import { errorLikeToString } from "../../common/drydock/ts-helpers/error-like-to-string";

export class addDescriptionToSpecificationSubItems1702542061320 implements MigrationInterface {
    tableName = 'specification_details_sub_item';
    schemaName = 'dry_dock';
    className = this.constructor.name;
    description = 'Update specification sub items table';
    columnName = 'description';

    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.query(`
            IF EXISTS (Select *
               from INFORMATION_SCHEMA.TABLES
               where TABLE_NAME = '${this.tableName}'
                 AND TABLE_SCHEMA = '${this.schemaName}')
                 AND
   NOT EXISTS(SELECT 1
              FROM sys.columns
              WHERE Name = N'${this.columnName}'
                AND Object_ID = Object_ID(N'${this.schemaName}.${this.tableName}'))
    BEGIN
         ALTER TABLE [${this.schemaName}].[${this.tableName}] ADD ${this.columnName} varchar(5000) NULL;
    END`);

            await MigrationUtilsService.migrationLog(this.className, '', 'S', 'dry_dock', this.description);
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                this.className,
                errorLikeToString(error),
                'E',
                'dry_dock',
                this.description,
                true,
            );
        }
    }

    public async down(): Promise<void> {}
}
