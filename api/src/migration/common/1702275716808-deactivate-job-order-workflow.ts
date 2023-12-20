import { MigrationUtilsService } from "j2utils";
import {MigrationInterface, QueryRunner} from "typeorm";

export class deactivateJobOrderWorkflow1702275716808 implements MigrationInterface {
    public className = this.constructor.name;
    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await MigrationUtilsService.createTableBackup('jms_dtl_workflow_config_details');

            await queryRunner.query(`
            BEGIN
                DECLARE @config_id int=(select ID from JMS_DTL_Workflow_config where JOB_Type='job_order' AND Active_Status=1)
			    Delete from jms_dtl_workflow_config_details where config_ID=@config_id
            END
            `);

            await MigrationUtilsService.migrationLog(
                this.className,
                '',
                'S',
                'dry_dock',
                'deactivate job order workflow',
            );

        } catch (error) {
            await MigrationUtilsService.migrationLog(
                this.className,
                JSON.stringify(error),
                'E',
                'dry_dock',
                'deactivate job order workflow',
                true,
            );
        }
    }
    public async down(): Promise<void> {}
}

