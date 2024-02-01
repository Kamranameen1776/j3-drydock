import { MigrationUtilsService } from "j2utils";
import {MigrationInterface, QueryRunner} from "typeorm";
import { errorLikeToString } from "../../common/drydock/ts-helpers/error-like-to-string";

export class vesselAttachmentRuleSync1703162641000 implements MigrationInterface {
    public className = this.constructor.name;
    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await MigrationUtilsService.createTableBackup('SYNC_DTL_Vessel_Import_Attachments_Rule');

            await queryRunner.query(`
            BEGIN
            DECLARE @applocation nvarchar(20)
            DECLARE @fieldID INT
            SET @applocation = (SELECT [value] FROM inf_lib_configuration WHERE [key] = 'location' )
            if(@applocation = 'vessel')
                BEGIN
                    DECLARE @rule_id int
                    SELECT @rule_id=ISNULL(max(Rule_ID),0) FROM SYNC_DTL_Vessel_Import_Attachments_Rule
                    BEGIN
                        MERGE INTO SYNC_DTL_Vessel_Import_Attachments_Rule AS TARGET USING (
                        VALUES
                        (@rule_id+1,'projdrydock_','C:\\JiBEApps\\uploads\\project\\dry_dock', 1, GETDATE(),NULL,NULL, NULL, NULL, 1),
                        (@rule_id+2,'projspec_','C:\\JiBEApps\\uploads\\project\\specification_details', 1, GETDATE(),NULL,NULL, NULL, NULL, 1)
                        )
                        AS SOURCE (Rule_ID, Attach_Prefix, Attach_Path, Created_By, Date_Of_Creation, Modified_By, Date_Of_Modification, Deleted_By, Date_Of_Deletion, Active_Status)

                        ON TARGET.[Attach_Path] = SOURCE.[Attach_Path]

                    WHEN MATCHED THEN
                    UPDATE SET TARGET.[Attach_Prefix] = SOURCE.[Attach_Prefix], TARGET.[Attach_Path] = SOURCE.[Attach_Path],
                    TARGET.[Active_Status] = SOURCE.[Active_Status]
                    WHEN NOT MATCHED BY TARGET THEN
                    INSERT ([Rule_ID], [Attach_Prefix], [Attach_Path], [Created_By],[Date_Of_Creation],[Modified_By],[Date_Of_Modification],[Deleted_By], [Date_Of_Deletion], [Active_Status])
                    VALUES (SOURCE.[Rule_ID], SOURCE.[Attach_Prefix], SOURCE.[Attach_Path], SOURCE.[Created_By], SOURCE.[Date_Of_Creation],
                    SOURCE.[Modified_By],SOURCE.[Date_Of_Modification], SOURCE.[Deleted_By], SOURCE.[Date_Of_Deletion], SOURCE.[Active_Status]);
                    END
                END
            END
            `);

            await MigrationUtilsService.migrationLog(
                this.className,
                '',
                'S',
                'dry_dock',
                'vessel attachment rule sync',
            );

        } catch (error) {
            await MigrationUtilsService.migrationLog(
                this.className,
                errorLikeToString(error),
                'E',
                'dry_dock',
                'vessel attachment rule sync',
                true,
            );
        }
    }
    public async down(queryRunner: QueryRunner): Promise<void> {}
}

