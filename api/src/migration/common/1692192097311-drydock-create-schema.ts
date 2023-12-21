import { MigrationUtilsService } from 'j2utils';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class dryDockCreateSchema1692192097311  implements MigrationInterface {
    schemaName = 'dry_dock';

    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.query(`
                 IF NOT EXISTS (SELECT 1 FROM sys.schemas where name = '${this.schemaName}')
                 BEGIN
                     EXEC ('CREATE SCHEMA ${this.schemaName};');
                 END;
                 `);

            await MigrationUtilsService.migrationLog(
                'dryDockCreateSchema1692192097311',
                '',
                'S',
                'dry_dock',
                'Create schema',
            );
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                'dryDockCreateSchema1692192097311',
                JSON.stringify(error),
                'E',
                'dry_dock',
                'Create schema',
                true,
            );
        }
    }

    public async down(): Promise<void> {}
}
