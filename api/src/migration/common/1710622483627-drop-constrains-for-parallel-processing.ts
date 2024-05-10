import { MigrationUtilsService } from 'j2utils';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { errorLikeToString } from '../../common/drydock/ts-helpers/error-like-to-string';

export class dropConstrainsForParallelProcessing1710622483627 implements MigrationInterface {
    className: string = this.constructor.name;
    moduleName: string = 'project';

    public async up(queryRunner: QueryRunner): Promise<void> {
        const message = `Drop constrains for parallel processing`;

        try {
            await queryRunner.query(`
        DECLARE @Command nvarchar(max), @ConstraintName nvarchar(max), @TableName nvarchar(max), @ColumnName nvarchar(max)
        SET @TableName = '[dry_dock].[specification_details_sub_item]'
        SET @ColumnName = 'specification_details_uid'
        SELECT @ConstraintName = name
            FROM sys.default_constraints
            WHERE parent_object_id = object_id(@TableName)
                AND parent_column_id = columnproperty(object_id(@TableName), @ColumnName, 'ColumnId')

        IF @ConstraintName IS NOT NULL
        BEGIN
        SELECT @Command = 'ALTER TABLE ' + @TableName + ' DROP CONSTRAINT ' + @ConstraintName
        EXECUTE sp_executeSQL @Command
        END;

        SET @TableName = '[dry_dock].[specification_details_LIB_Survey_CertificateAuthority]'
        SET @ColumnName = 'specification_details_uid'
        SELECT @ConstraintName = name
            FROM sys.default_constraints
            WHERE parent_object_id = object_id(@TableName)
                AND parent_column_id = columnproperty(object_id(@TableName), @ColumnName, 'ColumnId')

        IF @ConstraintName IS NOT NULL
        BEGIN
        SELECT @Command = 'ALTER TABLE ' + @TableName + ' DROP CONSTRAINT ' + @ConstraintName
        EXECUTE sp_executeSQL @Command
        END;
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
