import { MigrationUtilsService } from "j2utils";
import {MigrationInterface, QueryRunner} from "typeorm";
import { errorLikeToString } from "../../common/drydock/ts-helpers/error-like-to-string";

export class scriptToDeleteRecordsOfUncloseStatusForDryDock1707215166921 implements MigrationInterface {
    schemaName = 'dry_dock';
    className = this.constructor.name;
    moduleName = 'dry_dock';
    tableName = 'tec_task_manager'
    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.query(`
            IF NOT EXISTS(SELECT 1 FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[tec_task_manager_bk_06022024]') AND type in (N'U'))
            BEGIN
                select * into tec_task_manager_bk_06022024 from '${this.tableName}'
            END
            `);

            await queryRunner.query(`
            BEGIN
                DECLARE @PKValue varchar(250)
                DECLARE tbl_cursor CURSOR FOR

                SELECT uid FROM tec_task_manager Where task_status = 'unclose' and wl_type = 'dry_dock' and active_status = 1

                OPEN tbl_cursor

                FETCH NEXT FROM tbl_cursor
                INTO @PKValue

                WHILE @@FETCH_STATUS = 0
                BEGIN

                Delete from tec_task_manager where uid = @PKValue

                FETCH NEXT FROM tbl_cursor
                INTO @PKValue
                END

                CLOSE tbl_cursor;
                DEALLOCATE tbl_cursor;
            END
            `);

            await MigrationUtilsService.migrationLog(
                this.className,
                '',
                'S',
                this.moduleName,
                'Delete unclose status records',
            );
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                this.className,
                errorLikeToString(error),
                'E',
                this.moduleName,
                'Delete unclose status records',
                true,
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
