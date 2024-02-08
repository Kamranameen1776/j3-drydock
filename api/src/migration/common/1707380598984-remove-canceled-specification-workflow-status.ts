import { MigrationInterface, QueryRunner } from 'typeorm';
import { MigrationUtilsService } from 'j2utils';
import { errorLikeToString } from '../../common/drydock/ts-helpers/error-like-to-string';

export class removeCanceledSpecificationWorkflowStatus1707380598984 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.query(
                `UPDATE JMS_DTL_Workflow_config_Details SET Active_Status=0 WHERE status_display_name='Canceled' and right_code='tm_specification_cancel_office' and WorkflowType_ID='CANCEL';`
            );
            await MigrationUtilsService.migrationLog(
                'dryDockCreateSchema1692192097311',
                '',
                'S',
                'dry_dock',
                'Remove Canceled Specification Workflow Status',
            );
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                'dryDockCreateSchema1692192097311',
                errorLikeToString(error),
                'S',
                'dry_dock',
                'Remove Canceled Specification Workflow Status',
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
