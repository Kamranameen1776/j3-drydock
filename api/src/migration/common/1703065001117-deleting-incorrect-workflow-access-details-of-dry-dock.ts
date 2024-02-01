import {MigrationInterface, QueryRunner} from "typeorm";
import { MigrationUtilsService } from 'j2utils';
import { errorLikeToString } from "../../common/drydock/ts-helpers/error-like-to-string";

export class deletingIncorrectWorkflowAccessDetailsOfDryDock1703065001117 implements MigrationInterface {
    public className = this.constructor.name;
    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await MigrationUtilsService.createTableBackup('jms_dtl_workflow_config_details');

            await queryRunner.query(`
            BEGIN
                DECLARE @configId int=(select ID from JMS_DTL_Workflow_config where JOB_Type='dry_dock' AND Active_Status=1)
			    Delete from jms_dtl_workflow_config_details where config_ID = @configId
			END
            `);

            await MigrationUtilsService.migrationLog(
                this.className,
                '',
                'S',
                'dry_dock',
                'deleting incorrect workflow of dry dock',
            );

        } catch (error) {
            await MigrationUtilsService.migrationLog(
                this.className,
                errorLikeToString(error),
                'E',
                'dry_dock',
                'deleting incorrect workflow of dry dock',
                true,
            );
        }
    }
    public async down(queryRunner: QueryRunner): Promise<void> {}
}

