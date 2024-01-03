import { MigrationUtilsService } from 'j2utils';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class StaticDatesRebindStatementOfFactsDate1704199097034 implements MigrationInterface {
    public readonly name = this.constructor.name;
    protected readonly description = 'Rebind [dry_dock].[statement_of_facts].[date] to datetimeoffset';

    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            // Find and drop the default constraint, if one exists
            await queryRunner.query(`
                declare @constraint_name nvarchar(max);

                select
                    @constraint_name = name
                from
                    sys.default_constraints
                where
                    parent_object_id = object_id('[dry_dock].[statement_of_facts]')
                    and
                    parent_column_id = columnproperty(object_id('[dry_dock].[statement_of_facts]'), 'date', 'ColumnId')
                ;

                if @constraint_name is not null
                begin
                    exec('alter table [dry_dock].[statement_of_facts] drop constraint [' + @constraint_name + ']')
                end;
            `);

            // Alter the column type and add a new default constraint
            await queryRunner.query(`
                alter table
                    [dry_dock].[statement_of_facts]
                alter column
                    [date] datetimeoffset;

                alter table
                    [dry_dock].[statement_of_facts]
                add constraint
                    df_statement_of_facts_date
                        default (getutcdate())
                    for
                        [date];
            `);

            await MigrationUtilsService.migrationLog(this.name, '', 'S', 'dry_dock', this.description);
        } catch (e) {
            const error = JSON.stringify(e);
            await MigrationUtilsService.migrationLog(this.name, error, 'E', 'dry_dock', this.description, true);
        }
    }

    public async down(): Promise<void> {}
}
