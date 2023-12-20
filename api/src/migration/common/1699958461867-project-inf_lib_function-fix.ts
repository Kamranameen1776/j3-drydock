import { MigrationUtilsService } from 'j2utils';
import { MigrationInterface, QueryRunner } from 'typeorm';

// eslint-disable-next-line @typescript-eslint/naming-convention
export class ProjectInfLibFunctionFix1699958461867 implements MigrationInterface {
    /**
     * @description Populate INF_Lib_Function table with parent_function_code and parent_module_code
     * Environments     : All
     * Clients          : All
     */
    public className = this.constructor.name;
    public moduleName = 'project';
    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.query(
                `
                update INF_Lib_Function
                set parent_function_code = 'project',
                parent_module_code = 'project'
                where Function_Code = 'project'
            `,
            );

            await MigrationUtilsService.migrationLog(
                this.className,
                '',
                'S',
                this.moduleName,
                'Populate INF_Lib_Function table with parent_function_code and parent_module_code',
            );
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                this.className,
                error as string,
                'E',
                this.moduleName,
                'Populate INF_Lib_Function table with parent_function_code and parent_module_code',
                true,
            );
        }
    }

    public async down(): Promise<void> {}
}
