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
            UPDATE dbo.INF_Lib_Right SET api_url = N'/drydock/specification-details/sub-items/create-sub-item' WHERE Right_Code = 'add_sub_items' AND Module_Code = 'project'
            UPDATE dbo.INF_Lib_Right SET api_url = N'/jms/jms_attachment/getJmsAttachmentDetails' WHERE Right_Code = 'view_attachments_section' AND Module_Code = 'project'
            UPDATE dbo.INF_Lib_Right SET api_url = N'/drydock/specification-details/update-specification-details' WHERE Right_Code = 'edit_general_information' AND Module_Code = 'project'
            UPDATE dbo.INF_Lib_Right SET api_url = N'/drydock/specification-details/delete-specification-details' WHERE Right_Code = 'delete_specification_detail' AND Module_Code = 'project'
            UPDATE dbo.INF_Lib_Right SET api_url = N'/task-manager/task-manager-main/get-tm-findings-task-list' WHERE Right_Code = 'view_findings_section' AND Module_Code = 'project'
            UPDATE dbo.INF_Lib_Right SET api_url = N'/drydock/specification-details/get-specification-details' WHERE Right_Code = 'view_specification_detail' AND Module_Code = 'project'
            UPDATE dbo.INF_Lib_Right SET api_url = N'/drydock/specification-details/update-specification-details' WHERE Right_Code = 'edit_header_section' AND Module_Code = 'project'
            UPDATE dbo.INF_Lib_Right SET api_url = N'/infra/file/updateFileDetail' WHERE Right_Code = 'edit_attachments' AND Module_Code = 'project'
            UPDATE dbo.INF_Lib_Right SET api_url = N'/drydock/specification-details/sub-items/delete-sub-item' WHERE Right_Code = 'delete_sub_items' AND Module_Code = 'project'
            UPDATE dbo.INF_Lib_Right SET api_url = N'/drydock/specification-details/sub-items/update-sub-item' WHERE Right_Code = 'edit_sub_items' AND Module_Code = 'project'
            UPDATE dbo.INF_Lib_Right SET api_url = N'/infra/file/upload' WHERE Right_Code = 'add_attachments' AND Module_Code = 'project'
            UPDATE dbo.INF_Lib_Right SET api_url = N'/infra/file/updateFileDetail' WHERE Right_Code = 'delete_attachments' AND Module_Code = 'project'
            UPDATE dbo.INF_Lib_Right SET api_url = N'/drydock/specification-details/sub-items/find-sub-items' WHERE Right_Code = 'view_sub_items_section' AND Module_Code = 'project'
            UPDATE dbo.INF_Lib_Right SET api_url = N'/drydock/specification-details/update-specification-details' WHERE Right_Code = 'view_general_information_section' AND Module_Code = 'project'
            UPDATE dbo.INF_Lib_Right SET api_url = N'/drydock/standard-jobs/get-standard-jobs' WHERE Right_Code = 'standard_job_view_grid' AND Module_Code = 'project'
            UPDATE dbo.INF_Lib_Right SET api_url = N'/drydock/standard-jobs/create-standard-jobs' WHERE Right_Code = 'standard_job_create' AND Module_Code = 'project'
            UPDATE dbo.INF_Lib_Right SET api_url = N'/drydock/standard-jobs/update-standard-jobs' WHERE Right_Code = 'standard_job_edit' AND Module_Code = 'project'
            UPDATE dbo.INF_Lib_Right SET api_url = N'/drydock/standard-jobs/delete-standard-jobs' WHERE Right_Code = 'standard_job_delete' AND Module_Code = 'project'
            `);

            await MigrationUtilsService.migrationLog(
                this.className,
                '',
                'S',
                'project',
                'validate access rights',
            );
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                this.className,
                errorLikeToString(error),
                'E',
                'project',
                'validate access rights',
                true,
            );
        }
    }
    public async down(queryRunner: QueryRunner): Promise<void> {}
}
