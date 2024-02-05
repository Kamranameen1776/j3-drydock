import { MigrationInterface, QueryRunner } from 'typeorm';

export class addUtilizedToSpecificationSubItem1704990552775 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "dry_dock"."specification_details_sub_item"
                ADD "utilized" decimal(10, 4) NOT NULL DEFAULT 0;
        `);
    }

    public async down(): Promise<void> {
    }
}
