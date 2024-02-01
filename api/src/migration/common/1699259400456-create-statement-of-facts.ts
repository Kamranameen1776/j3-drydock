import { MigrationUtilsService } from 'j2utils';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { errorLikeToString } from '../../common/drydock/ts-helpers/error-like-to-string';

// eslint-disable-next-line @typescript-eslint/naming-convention
export class createStatementOfFacts1699259400456 implements MigrationInterface {
    tableName = 'statement_of_facts';
    schemaName = 'dry_dock';

    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.query(`
            IF NOT EXISTS (Select *
               from INFORMATION_SCHEMA.TABLES
               where TABLE_NAME = '${this.tableName}'
                 AND TABLE_SCHEMA = '${this.schemaName}')
    BEGIN
            CREATE TABLE [dry_dock].[statement_of_facts](
                [uid] [uniqueidentifier] NOT NULL,
                [fact] [varchar](350) NOT NULL,
                [date] [datetime] NOT NULL,
                [active_status] [bit] NOT NULL,
                [created_at] [datetime2](7) NOT NULL,
                [project_uid] [uniqueidentifier] NULL,
            PRIMARY KEY CLUSTERED
            (
                [uid] ASC
            )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
            ) ON [PRIMARY]

            ALTER TABLE [dry_dock].[statement_of_facts] ADD  CONSTRAINT [DF_statement_of_facts_uid]  DEFAULT (newid()) FOR [uid]

            ALTER TABLE [dry_dock].[statement_of_facts] ADD  DEFAULT ((1)) FOR [active_status]

            ALTER TABLE [dry_dock].[statement_of_facts] ADD  DEFAULT (getdate()) FOR [created_at]

            ALTER TABLE [dry_dock].[statement_of_facts]  WITH CHECK ADD  CONSTRAINT [FK_statement_of_facts_project_uid] FOREIGN KEY([project_uid])
            REFERENCES [dry_dock].[project] ([uid])

            ALTER TABLE [dry_dock].[statement_of_facts] CHECK CONSTRAINT [FK_statement_of_facts_project_uid]
    END`);

            await MigrationUtilsService.migrationLog(
                'createStatementOfFacts1699259400456',
                '',
                'S',
                'dry_dock',
                `Create ${this.tableName} table`,
            );
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                'createStatementOfFacts1699259400456',
                errorLikeToString(error),
                'E',
                'dry_dock',
                `Create ${this.tableName} table`,
                true,
            );
        }
    }

    public async down(): Promise<void> {}
}
