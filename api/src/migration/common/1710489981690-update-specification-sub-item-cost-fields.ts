import { MigrationInterface, QueryRunner } from 'typeorm';
import { MigrationUtilsService } from 'j2utils';
import { errorLikeToString } from '../../common/drydock/ts-helpers/error-like-to-string';

export class updateSpecificationSubItemCostFields1710489981690 implements MigrationInterface {
    className: string = this.constructor.name;
    moduleName: string = 'project';
    schemaName = 'dry_dock';
    tableName = 'specification_details_sub_item';
    message = `Update cost field types in ${this.schemaName}.${this.tableName}`;


    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.query(`
                alter table ${this.schemaName}.${this.tableName}
                alter column cost decimal(20, 4);

                alter table ${this.schemaName}.${this.tableName}
                alter column utilized decimal(20, 4);

                alter table ${this.schemaName}.${this.tableName}
                alter column estimated_cost decimal(20, 4)
            `);
            await MigrationUtilsService.migrationLog(this.className, '', 'S', this.moduleName, this.message);
        } catch (e) {
            await MigrationUtilsService.migrationLog(
                this.className,
                errorLikeToString(e),
                'E',
                this.moduleName,
                this.message,
                true,
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
