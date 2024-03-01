import { MigrationUtilsService } from "j2utils";
import { MigrationInterface, QueryRunner} from "typeorm";
import { errorLikeToString } from "../../common/drydock/ts-helpers/error-like-to-string";

export class validateProjectAccessRights1709292758839 implements MigrationInterface {
    public className = this.constructor.name;
    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await MigrationUtilsService.createTableBackup('inf_lib_right');

            await queryRunner.query(`
            UPDATE dbo.INF_Lib_Right SET api_url = N'/drydock/projects/get-projects-for-main-page' WHERE Right_Code = 'projects_view_list' AND Module_Code = 'project'
            UPDATE dbo.INF_Lib_Right SET api_url = N'/drydock/projects/create-project' WHERE Right_Code = 'dry_dock_project_create' AND Module_Code = 'project'
            UPDATE dbo.INF_Lib_Right SET api_url = N'/drydock/projects/delete-project' WHERE Right_Code = 'dry_dock_project_delete' AND Module_Code = 'project'
            UPDATE dbo.INF_Lib_Right SET api_url = N'/drydock/projects/get-projects-for-main-page' WHERE Right_Code = 'dry_dock_project_view_details' AND Module_Code = 'project'
            UPDATE dbo.INF_Lib_Right SET api_url = N'/drydock/projects/update-project' WHERE Right_Code = 'dry_dock_project_edit_header' AND Module_Code = 'project'
            UPDATE dbo.INF_Lib_Right SET api_url = N'/infra/file/upload' WHERE Right_Code = 'dry_dock_project_attachment_add' AND Module_Code = 'project'
            UPDATE dbo.INF_Lib_Right SET api_url = N'/infra/file/updateFileDetail' WHERE Right_Code = 'dry_dock_project_attachment_edit' AND Module_Code = 'project'
            UPDATE dbo.INF_Lib_Right SET api_url = N'/infra/file/updateFileDetail' WHERE Right_Code = 'dry_dock_project_attachment_delete' AND Module_Code = 'project'
            UPDATE dbo.INF_Lib_Right SET api_url = N'/drydock/projects/delete-project' WHERE Right_Code = 'dry_dock_project_delete' AND Module_Code = 'project'
            UPDATE dbo.INF_Lib_Right SET api_url = N'/drydock/projects/update-project' WHERE Right_Code = 'dry_dock_project_immediate_closure' AND Module_Code = 'project'
            `);

            await MigrationUtilsService.migrationLog(
                this.className,
                '',
                'S',
                'project',
                'validate project access rights',
            );
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                this.className,
                errorLikeToString(error),
                'E',
                'project',
                'validate project access rights',
                true,
            );
        }
    }
    public async down(queryRunner: QueryRunner): Promise<void> {}
}
