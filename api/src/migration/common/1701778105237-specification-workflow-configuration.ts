import { MigrationUtilsService } from "j2utils";
import {MigrationInterface, QueryRunner} from "typeorm";

export class specificationWorkflowConfiguration1701778105237 implements MigrationInterface {
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
                'specification workflow configuration',
            );

        } catch (error) {
            await MigrationUtilsService.migrationLog(
                this.className,
                JSON.stringify(error),
                'E',
                'dry_dock',
                'specification workflow configuration',
                true,
            );
        }
    }
    public async down(queryRunner: QueryRunner): Promise<void> {}
}
