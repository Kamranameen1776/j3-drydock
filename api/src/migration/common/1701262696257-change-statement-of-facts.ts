import { MigrationUtilsService } from 'j2utils';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { errorLikeToString } from "../../common/drydock/ts-helpers/error-like-to-string";

// eslint-disable-next-line @typescript-eslint/naming-convention
export class changeStatementOfFacts1701262696257 implements MigrationInterface {
    tableName = 'statement_of_facts';
    schemaName = 'dry_dock';

    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.query(`

            DECLARE @Command nvarchar(max), @ConstraintName nvarchar(max), @TableName nvarchar(max), @ColumnName nvarchar(max)
            SET @TableName = '[dry_dock].[statement_of_facts]'
            SET @ColumnName = 'created_at'
            SELECT @ConstraintName = name
                FROM sys.default_constraints
                WHERE parent_object_id = object_id(@TableName)
                    AND parent_column_id = columnproperty(object_id(@TableName), @ColumnName, 'ColumnId')

            IF @ConstraintName IS NOT NULL
            BEGIN
            SELECT @Command = 'ALTER TABLE ' + @TableName + ' DROP CONSTRAINT ' + @ConstraintName
            EXECUTE sp_executeSQL @Command
            END;

            ALTER TABLE [dry_dock].[statement_of_facts] ADD  DEFAULT (GETUTCDATE()) FOR [created_at];

            `);

            await MigrationUtilsService.migrationLog(
                'changeStatementOfFacts1701262696257',
                '',
                'S',
                'dry_dock',
                `change ${this.tableName} table`,
            );
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                'changeStatementOfFacts1701262696257',
                errorLikeToString(error),
                'E',
                'dry_dock',
                `change ${this.tableName} table`,
                true,
            );
        }
    }

    public async down(): Promise<void> {}
}
