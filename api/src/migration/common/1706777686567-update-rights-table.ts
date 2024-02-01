import { MigrationInterface, QueryRunner } from 'typeorm';
import { MigrationUtilsService } from 'j2utils';

export class updateGroupsStatusTable1706022198368 implements MigrationInterface {
    schemaName = 'dbo';
    className = this.constructor.name;
    moduleName = 'dry_dock';
    tableName = 'INF_Lib_Right'
    public async up(queryRunner: QueryRunner): Promise<void> {
            try {
            await queryRunner.query(`
                UPDATE dbo.INF_Lib_Right SET api_url = N'/drydock/projects/get-project' WHERE Right_Code = 'dry_dock_project_view_details' AND Module_Code = 'project'
                UPDATE dbo.INF_Lib_Right SET api_url = N'/drydock/specification-details/update-specification-details' WHERE Right_Code = 'edit_general_information' AND Module_Code = 'project'

                UPDATE dbo.INF_Lib_Right SET api_url = N'/drydock/projects/get-projects-for-main-page' WHERE Right_Code = 'projects_view_list' AND Module_Code = 'project'
                UPDATE dbo.INF_Lib_Right SET api_url = N'/drydock/specification-details/get-many-specification-details' WHERE Right_Code = 'view_specification_detail' AND Module_Code = 'project'

                UPDATE dbo.INF_Lib_Right SET api_url = N'/drydock/standard-jobs/get-standard-jobs' WHERE Right_Code = 'standard_job_view_grid' AND Module_Code = 'project'
                UPDATE dbo.INF_Lib_Right SET api_url = N'/drydock/specification-details/sub-items/find-sub-items' WHERE Right_Code = 'view_sub_items_section' AND Module_Code = 'project'
                UPDATE dbo.INF_Lib_Right SET api_url = N'/drydock/specification-details/get-specification-details' WHERE Right_Code = 'view_general_information_section' AND Module_Code = 'project'
            `);

            await MigrationUtilsService.migrationLog(
                this.className,
                '',
                'S',
                this.moduleName,
                `Update data in ${this.tableName}`,
            );
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                this.className,
                error as string,
                'E',
                this.moduleName,
                `Update data in ${this.tableName}`,
                true,
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
