import { MigrationUtilsService } from 'j2utils';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTableGroupProjectStatus1698663404380 implements MigrationInterface {
    tableName = 'project';
    schemaName = 'dry_dock';

    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.query(`

            CREATE TABLE [dry_dock].[group_project_status](
                [uid] [uniqueidentifier] NOT NULL DEFAULT(NEWID()),

                -- Completed, Planned, Active
                [group_status_id] [varchar](50) NOT NULL,

                -- [TEC_LIB_Worklist_Type] -> [Worklist_Type]
                [Worklist_Type] [varchar](50) NOT NULL,

                -- [JMS_DTL_Workflow_config_Details] -> [WrokFlowType_ID]
                [WorkFlowType_ID] [varchar](50) NOT NULL,

                [active_status] [bit] NOT NULL DEFAULT(1),
             CONSTRAINT [PK_testtable123] PRIMARY KEY CLUSTERED
            (
                [uid] ASC
            )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
            ) ON [PRIMARY]




MERGE INTO [dry_dock].[group_project_status] AS target
USING (
    SELECT 'Planned' AS group_status_id, 'dry_dock' AS Worklist_Type, 'RAISE' AS WorkFlowType_ID
    UNION ALL
    SELECT 'Active', 'dry_dock', 'IN PROGRESS'
    UNION ALL
    SELECT 'Complete', 'dry_dock', 'COMPLETE'
    UNION ALL
    SELECT 'Complete', 'dry_dock', 'VERIFY'
    UNION ALL
    SELECT 'Complete', 'dry_dock', 'REVIEW'
    UNION ALL
    SELECT 'Complete', 'dry_dock', 'APPROVE'
    UNION ALL
    SELECT 'Close', 'dry_dock', 'CLOSE'
    UNION ALL
    SELECT 'Active', 'dry_dock', 'UNCLOSE'
) AS source
ON target.group_status_id = source.group_status_id
AND target.Worklist_Type = source.Worklist_Type
AND target.WorkFlowType_ID = source.WorkFlowType_ID
WHEN MATCHED THEN
    UPDATE SET target.group_status_id = source.group_status_id,
                target.Worklist_Type = source.Worklist_Type,
                target.WorkFlowType_ID = source.WorkFlowType_ID
WHEN NOT MATCHED THEN
    INSERT (group_status_id, Worklist_Type, WorkFlowType_ID)
    VALUES (source.group_status_id, source.Worklist_Type, source.WorkFlowType_ID);


            `);

            await MigrationUtilsService.migrationLog(
                'AddTableGroupProjectStatus1698663404380',
                '',
                'S',
                'dry_dock',
                'Add table group_project_status (Up migration)',
            );
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                'AddTableGroupProjectStatus1698663404380',
                JSON.stringify(error),
                'E',
                'dry_dock',
                'Add table group_project_status (Up migration)',
                true,
            );
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public async down(): Promise<void> {}
}
