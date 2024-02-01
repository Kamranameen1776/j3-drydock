import { MigrationUtilsService } from "j2utils";
import {MigrationInterface, QueryRunner} from "typeorm";
import { errorLikeToString } from "../../common/drydock/ts-helpers/error-like-to-string";

export class updatingAttachPrefixOfDryDockSpecAndStandardJobs1703248160022 implements MigrationInterface {
    public className = this.constructor.name;
    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await MigrationUtilsService.createTableBackup('INF_Lib_Function');

            await queryRunner.query(`
            MERGE INTO INF_Lib_Function AS TARGET USING (
            VALUES
            (N'F808DA39-BA82-482B-90D8-912ECB41BC04', 'projdrydock'),
            (N'660941D8-B00B-4C58-AD32-1F0A144B1C88', 'projspec'),
            (N'9C79EF57-A1C6-40B4-A343-968976325150', 'projstandard')
            )
            AS SOURCE ([Function_UID], [attach_prefix])

            ON TARGET.[Function_UID] = SOURCE.[Function_UID]

            WHEN MATCHED THEN

            UPDATE SET [Modified_By] = 1, [Date_Of_Modification] = GETDATE(), TARGET.[attach_prefix] = SOURCE.[attach_prefix];
            `);

            await MigrationUtilsService.migrationLog(
                this.className,
                '',
                'S',
                'dry_dock',
                'updating attach prefix',
            );

        } catch (error) {
            await MigrationUtilsService.migrationLog(
                this.className,
                errorLikeToString(error),
                'E',
                'dry_dock',
                'updating attach prefix',
                true,
            );
        }
    }
    public async down(queryRunner: QueryRunner): Promise<void> {}
}

