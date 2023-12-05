import { MigrationUtilsService } from "j2utils";
import {MigrationInterface, QueryRunner} from "typeorm";

export class dryDockDetailsWorkflowConfiguration1701778022298 implements MigrationInterface {
    public className = this.constructor.name;
    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await MigrationUtilsService.createTableBackup('JMS_DTL_Workflow_config');
            await MigrationUtilsService.createTableBackup('jms_dtl_workflow_config_details');

            await queryRunner.query(`

            `);

            await queryRunner.query(`

            `);

            await queryRunner.query(`
        
            `);

            await MigrationUtilsService.migrationLog(
                this.className,
                '',
                'S',
                'dry_dock',
                'dry dock detail workflow configuration',
            );

        } catch (error) {
            await MigrationUtilsService.migrationLog(
                this.className,
                JSON.stringify(error),
                'E',
                'dry_dock',
                'dry dock detail workflow configuration',
                true,
            );
        }
    }
    public async down(queryRunner: QueryRunner): Promise<void> {}
}
