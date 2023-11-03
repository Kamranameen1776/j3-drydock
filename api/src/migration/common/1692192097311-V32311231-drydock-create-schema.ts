import { MigrationUtilsService } from 'j2utils';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class V32311231DryDockCreateSchema1692192097311 implements MigrationInterface {
    public className = this.constructor.name;
    public moduleName = 'drydock';
    public functionName = 'Create database schema: "drydock"';
    schemaName = 'dry_dock';

    /**
     * @description Create database schema: "drydock"

     * Purpose          : This is a primary schema for inventory module
     * Environments     : All
     * Clients          : All
     */
    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.query(
                `
                IF NOT EXISTS (SELECT 1 FROM sys.schemas where name = '${this.schemaName}')
                BEGIN
                    EXEC ('CREATE SCHEMA [${this.schemaName}];')
                END;
            `,
            );

            await MigrationUtilsService.migrationLog(this.className, '', 'S', this.moduleName, this.functionName);
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                this.className,
                error as string,
                'E',
                this.moduleName,
                this.functionName,
                true,
            );
        }
    }

    public async down(): Promise<void> {
        // No need to drop schema
    }
}
