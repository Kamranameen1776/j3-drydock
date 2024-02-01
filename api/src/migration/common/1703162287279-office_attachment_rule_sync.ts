import { MigrationUtilsService } from "j2utils";
import {MigrationInterface, QueryRunner} from "typeorm";

export class officeAttachmentRuleSync1703162287279 implements MigrationInterface {
    public className = this.constructor.name;
    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await MigrationUtilsService.createTableBackup('SYNC_DTL_Office_Import_Attachments_Rule');

            await queryRunner.query(`
            DECLARE @app_location nvarchar(20);
            SET @app_location = (SELECT [value] FROM inf_lib_configuration WHERE [key] = 'location')
            IF(@app_location = 'office')
            BEGIN
                DECLARE @rule_id int
                SELECT @rule_id=ISNULL(max(Rule_ID),0) FROM SYNC_DTL_Office_Import_Attachments_Rule 
                BEGIN
                    MERGE INTO SYNC_DTL_Office_Import_Attachments_Rule AS TARGET USING (
                    VALUES      
                    (@rule_id+1, 'projdrydock_', 'uploads\project\dry_dock', 1, GETDATE(), NULL, NULL, NULL, NULL, 1),
                    (@rule_id+2, 'projspec_', 'uploads\project\specification_details', 1, GETDATE(), NULL, NULL, NULL, NULL, 1)                    )
            
                    AS SOURCE (Rule_ID, Attach_Prefix, Attach_Path, Created_By, Date_Of_Creation, Modified_By, Date_Of_Modification, Deleted_By, Date_Of_Deletion, Active_Status)
            
                    ON TARGET.[Attach_Prefix] = SOURCE.[Attach_Prefix] and TARGET.[Attach_Path] = SOURCE.[Attach_Path]
            
                    WHEN MATCHED THEN
                    UPDATE SET TARGET.[Attach_Prefix] = SOURCE.[Attach_Prefix], TARGET.[Attach_Path] = SOURCE.[Attach_Path],
                    TARGET.[modified_by] = 1,TARGET.[date_of_modification] = GETDATE(), TARGET.[Deleted_By] = 1, TARGET.[Date_Of_Deletion] = GETDATE(), TARGET.[Active_Status] = SOURCE.[Active_Status]
                    WHEN NOT MATCHED BY TARGET THEN
                    INSERT ([Rule_ID], [Attach_Prefix], [Attach_Path], [Created_By],[Date_Of_Creation],[Modified_By],[Date_Of_Modification],[Deleted_By], [Date_Of_Deletion], [Active_Status])
                    VALUES (SOURCE.[Rule_ID], SOURCE.[Attach_Prefix], SOURCE.[Attach_Path], SOURCE.[Created_By], SOURCE.[Date_Of_Creation],
                    SOURCE.[Modified_By],SOURCE.[Date_Of_Modification], SOURCE.[Deleted_By], SOURCE.[Date_Of_Deletion], SOURCE.[Active_Status]);
                END
            END
            `);

            await MigrationUtilsService.migrationLog(
                this.className,
                '',
                'S',
                'dry_dock',
                'office attachment rule sync',
            );

        } catch (error) {
            await MigrationUtilsService.migrationLog(
                this.className,
                JSON.stringify(error),
                'E',
                'dry_dock',
                'office attachment rule sync',
                true,
            );
        }
    }
    public async down(queryRunner: QueryRunner): Promise<void> {}
}



