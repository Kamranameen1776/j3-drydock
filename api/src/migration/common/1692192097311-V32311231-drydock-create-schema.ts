import { MigrationUtilsService } from 'j2utils';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class V32311231DryDockCreateSchema1692192097311 implements MigrationInterface {
    public className = this.constructor.name;
    public moduleName = 'drydock';
    public functionName = 'Create database schema: "drydock"';

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
                IF NOT EXISTS (SELECT 1 FROM sys.schemas where name = 'drydock')
                BEGIN
                    EXEC ('CREATE SCHEMA [drydock];')
                END;

                IF OBJECT_ID(N'[drydock].[ExampleProject]', N'U') IS NULL
                CREATE TABLE [drydock].[ExampleProject] (
                    [ExampleProjectId] int IDENTITY(1,1) NOT NULL,
                    [ProjectName] nvarchar(100) NOT NULL,
                    [DateOfCreation] datetime2(7) NOT NULL
                );
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
