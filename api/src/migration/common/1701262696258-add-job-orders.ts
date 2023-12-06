import { MigrationUtilsService } from 'j2utils';
import { MigrationInterface, QueryRunner } from 'typeorm';

// eslint-disable-next-line @typescript-eslint/naming-convention
export class AddJobOrders1701262696258 implements MigrationInterface {
    /**
     * @description Add Job Orders
     * Environments     : All
     * Clients          : All
     */
    public className = this.constructor.name;
    public moduleName = 'project';
    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.query(
                `
                CREATE TABLE [dry_dock].[job_orders](
                    [uid] [uniqueidentifier] NOT NULL,
                    [project_uid] [uniqueidentifier] NOT NULL,
                    [specification_uid] [uniqueidentifier] NOT NULL,
                    [subject] [varchar](200) NOT NULL,
                    [remarks] [varchar](5000) NULL,
                    [progress] [int] NOT NULL,
                    [status] [varchar](50) NOT NULL,
                    [created_at] [datetime2](7) NOT NULL,
                    [active_status] [bit] NOT NULL,
                 CONSTRAINT [PK_job_orders] PRIMARY KEY CLUSTERED 
                (
                    [uid] ASC
                )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
                ) ON [PRIMARY];
                
                ALTER TABLE [dry_dock].[job_orders] ADD  CONSTRAINT [DF_job_orders_active_status]  DEFAULT ((1)) FOR [active_status];
                ALTER TABLE [dry_dock].[job_orders] ADD  CONSTRAINT [DF_job_orders_created_at]  DEFAULT ((GETUTCDATE())) FOR [created_at];




                CREATE TABLE [dry_dock].[job_order_updates](
                    [uid] [uniqueidentifier] NOT NULL,
                    [job_order_uid] [uniqueidentifier] NOT NULL,
                    [updated_by_uid] [uniqueidentifier] NOT NULL,
                    [created_at] [datetime2](7) NOT NULL,
                    [active_status] [bit] NOT NULL,
                 CONSTRAINT [PK_job_order_updates] PRIMARY KEY CLUSTERED 
                (
                    [uid] ASC
                )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
                ) ON [PRIMARY];
                
                ALTER TABLE [dry_dock].[job_order_updates] ADD  CONSTRAINT [DF_job_order_updates_active_status]  DEFAULT ((1)) FOR [active_status];
                ALTER TABLE [dry_dock].[job_order_updates] ADD  CONSTRAINT [DF_job_order_updates_created_at]  DEFAULT ((GETUTCDATE())) FOR [created_at];



            `,
            );

            await MigrationUtilsService.migrationLog(
                this.className,
                '',
                'S',
                this.moduleName,
                'Add Job Orders',
            );
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                this.className,
                error as string,
                'E',
                this.moduleName,
                'Add Job Orders',
                true,
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> { }
}
