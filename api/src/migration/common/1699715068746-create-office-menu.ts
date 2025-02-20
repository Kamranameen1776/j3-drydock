import { eApplicationLocation, MigrationUtilsService } from 'j2utils';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { errorLikeToString } from '../../common/drydock/ts-helpers/error-like-to-string';

// eslint-disable-next-line @typescript-eslint/naming-convention
export class createOfficeMenu1699715068747 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const appLocation = await MigrationUtilsService.getApplicationLocation();
        if (appLocation !== eApplicationLocation.Office) {
            return;
        }

        try {
            await queryRunner.query(`
            DECLARE @Menu_Code INT = 0, @Mod_Code INT , @Menu_Type INT

            EXEC [inf].[utils_inf_backup_table] 'Lib_Menu'

            --Root
            IF NOT EXISTS (SELECT 1
            FROM   lib_menu
            WHERE  menu_short_discription = 'Projects'
                   AND [menu_discription] = 'Projects'
                   AND [menu_link] IS NULL
                   AND active_status = 1)
                BEGIN
                    INSERT INTO lib_menu ([menu_code], [mod_code], [menu_type], [menu_short_discription], [menu_link], [menu_discription],
                                    [created_by], [date_of_created],  [active_status], [priority_sequence], [sequence_order], [menu_enable], [right_code])
                    VALUES      ( (SELECT Max(menu_code) + 1 FROM   lib_menu), NULL, NULL,'Projects',  NULL,'Projects',
                                    1,  Getdate(),  1,  0, (SELECT Isnull( Max(sequence_order), 0 ) + 1 FROM   lib_menu WHERE  menu_type IS NULL AND active_status = 1), 1,  NULL )
                END

            --Projects Main
            IF NOT EXISTS ( SELECT 1 FROM Lib_Menu WHERE Menu_Short_Discription = 'Projects Main' AND Active_Status = 1 and [Menu_Link] = 'dry-dock/projects-main-page' )
            BEGIN
                SELECT TOP 1 @Mod_Code = Mod_Code, @Menu_Type = Menu_Code FROM Lib_Menu WHERE
                    menu_short_discription = 'Projects'
                   AND [menu_discription] = 'Projects'
                   AND [menu_link] IS NULL
                   AND active_status = 1

                INSERT INTO Lib_Menu ( [Menu_Code], [Mod_Code], [Menu_Type], [Menu_Short_Discription], [Menu_Link], [Menu_Discription],
                                    [Created_By], [Date_Of_Created], [Active_Status], [Priority_Sequence], [Sequence_Order], [Menu_Enable], [Right_Code] )
                VALUES ( ( SELECT MAX(Menu_Code)+ 1 FROM Lib_Menu ), @Mod_Code, @Menu_Type, 'Projects Main' , 'dry-dock/projects-main-page', 'Projects Main' , 1, GETDATE(), 1, 0,
                        ( SELECT ISNULL(Max(Sequence_Order), 0) + 1 FROM Lib_Menu WHERE Menu_Type IS NOT NULL AND Active_Status = 1 ), 1, 'projects_view_list')
            END

            --Standard Jobs
            IF NOT EXISTS ( SELECT 1 FROM Lib_Menu WHERE Menu_Short_Discription = 'Standard Jobs' AND Active_Status = 1 and [Menu_Link] = 'dry-dock/standard-jobs-main' )
            BEGIN
                SELECT TOP 1 @Mod_Code = Mod_Code, @Menu_Type = Menu_Code FROM Lib_Menu WHERE
                    menu_short_discription = 'Projects'
                   AND [menu_discription] = 'Projects'
                   AND [menu_link] IS NULL
                   AND active_status = 1

                INSERT INTO Lib_Menu ( [Menu_Code], [Mod_Code], [Menu_Type], [Menu_Short_Discription], [Menu_Link], [Menu_Discription],
                                    [Created_By], [Date_Of_Created], [Active_Status], [Priority_Sequence], [Sequence_Order], [Menu_Enable], [Right_Code] )
                VALUES ( ( SELECT MAX(Menu_Code)+ 1 FROM Lib_Menu ), @Mod_Code, @Menu_Type, 'Standard Jobs' , 'dry-dock/standard-jobs-main', 'Standard Jobs' , 1, GETDATE(), 1, 0,
                        ( SELECT ISNULL(Max(Sequence_Order), 0) + 1 FROM Lib_Menu WHERE Menu_Type IS NOT NULL AND Active_Status = 1 ), 1, 'standard_job_view_grid')
            END

            --Project Templates
            IF NOT EXISTS ( SELECT 1 FROM Lib_Menu WHERE Menu_Short_Discription = 'Project Templates' AND Active_Status = 1 and [Menu_Link] = 'dry-dock/project-templates-main' )
            BEGIN
                SELECT TOP 1 @Mod_Code = Mod_Code, @Menu_Type = Menu_Code FROM Lib_Menu WHERE
                    menu_short_discription = 'Projects'
                   AND [menu_discription] = 'Projects'
                   AND [menu_link] IS NULL
                   AND active_status = 1

                INSERT INTO Lib_Menu ( [Menu_Code], [Mod_Code], [Menu_Type], [Menu_Short_Discription], [Menu_Link], [Menu_Discription],
                                    [Created_By], [Date_Of_Created], [Active_Status], [Priority_Sequence], [Sequence_Order], [Menu_Enable], [Right_Code] )
                VALUES ( ( SELECT MAX(Menu_Code)+ 1 FROM Lib_Menu ), @Mod_Code, @Menu_Type, 'Project Templates' , 'dry-dock/project-templates-main', 'Project Templates' , 1, GETDATE(), 1, 0,
                        ( SELECT ISNULL(Max(Sequence_Order), 0) + 1 FROM Lib_Menu WHERE Menu_Type IS NOT NULL AND Active_Status = 1 ), 1, 'project_template_view_list')
            END
            `);

            await MigrationUtilsService.migrationLog(
                'createOfficeMenu1699715068745',
                '',
                'S',
                'dry_dock',
                'Create office menu',
            );
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                'createOfficeMenu1699715068745',
                errorLikeToString(error),
                'E',
                'dry_dock',
                'Create office menu',
                true,
            );
        }
    }

    public async down(): Promise<void> {}
}
