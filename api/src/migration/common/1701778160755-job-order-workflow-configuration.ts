import { MigrationUtilsService } from "j2utils";
import {MigrationInterface, QueryRunner} from "typeorm";

export class jobOrderWorkflowConfiguration1701778160755 implements MigrationInterface {
    public className = this.constructor.name;
    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
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
                'job order workflow configuration',
            );

        } catch (error) {
            await MigrationUtilsService.migrationLog(
                this.className,
                JSON.stringify(error),
                'E',
                'dry_dock',
                'job order workflow configuration',
                true,
            );
        }
    }
    public async down(queryRunner: QueryRunner): Promise<void> {}
}

