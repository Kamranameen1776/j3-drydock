import { MigrationUtilsService } from 'j2utils';
import { MigrationInterface, QueryRunner } from 'typeorm';

// eslint-disable-next-line @typescript-eslint/naming-convention
export class staticDatesRebind1703829281014 implements MigrationInterface {
    public readonly name = this.constructor.name;
    public readonly description = 'Rebind datetime to datetimeoffset for drydock tables';

    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.query(`
            DECLARE @Command nvarchar(max), @ConstraintName nvarchar(max), @TableName nvarchar(max), @ColumnName nvarchar(max)
            SET @TableName = '[dry_dock].[standard_jobs]'
            SET @ColumnName = 'created_at'
            SELECT @ConstraintName = name
                FROM sys.default_constraints
                WHERE parent_object_id = object_id(@TableName)
                    AND parent_column_id = columnproperty(object_id(@TableName), @ColumnName, 'ColumnId')
                    
            IF @ConstraintName IS NOT NULL
            BEGIN
            SELECT @Command = 'ALTER TABLE ' + @TableName + ' DROP CONSTRAINT ' + @ConstraintName  
            EXECUTE sp_executeSQL @Command
            END;
            
            ALTER TABLE  [dry_dock].[standard_jobs]
			ALTER column [created_at] datetimeoffset;
            ALTER TABLE [dry_dock].[standard_jobs] ADD  DEFAULT (GETUTCDATE()) FOR [created_at];

			ALTER TABLE  [dry_dock].[standard_jobs]
			ALTER column updated_at datetimeoffset;

			ALTER TABLE  [dry_dock].[standard_jobs]
			ALTER column deleted_at datetimeoffset;


            SET @Command = null
			SET @ConstraintName= null
            SET @TableName = '[dry_dock].[daily_reports]'
            SET @ColumnName = 'created_at'
            SELECT @ConstraintName = name
                FROM sys.default_constraints
                WHERE parent_object_id = object_id(@TableName)
                    AND parent_column_id = columnproperty(object_id(@TableName), @ColumnName, 'ColumnId')
                    
            IF @ConstraintName IS NOT NULL
            BEGIN
            SELECT @Command = 'ALTER TABLE ' + @TableName + ' DROP CONSTRAINT ' + @ConstraintName  
            EXECUTE sp_executeSQL @Command
            END;
            
            ALTER TABLE  [dry_dock].[daily_reports]
			ALTER column [created_at] datetimeoffset;
            ALTER TABLE [dry_dock].[daily_reports] ADD  DEFAULT (GETUTCDATE()) FOR [created_at];

			ALTER TABLE  [dry_dock].[daily_reports]
			ALTER column updated_at datetimeoffset;

			ALTER TABLE  [dry_dock].[daily_reports]
			ALTER column deleted_at datetimeoffset;


            SET @Command = null
			SET @ConstraintName= null
            SET @TableName = '[dry_dock].[daily_report_updates]'
            SET @ColumnName = 'created_at'
            SELECT @ConstraintName = name
                FROM sys.default_constraints
                WHERE parent_object_id = object_id(@TableName)
                    AND parent_column_id = columnproperty(object_id(@TableName), @ColumnName, 'ColumnId')
                    
            IF @ConstraintName IS NOT NULL
            BEGIN
            SELECT @Command = 'ALTER TABLE ' + @TableName + ' DROP CONSTRAINT ' + @ConstraintName  
            EXECUTE sp_executeSQL @Command
            END;
            
            ALTER TABLE [dry_dock].[daily_report_updates] ADD  DEFAULT (GETUTCDATE()) FOR [created_at];

			ALTER TABLE  [dry_dock].[daily_report_updates]
			ALTER column updated_at datetimeoffset;

			ALTER TABLE  [dry_dock].[daily_report_updates]
			ALTER column deleted_at datetimeoffset;


            SET @Command = null
			SET @ConstraintName= null
            SET @TableName = '[dry_dock].[job_orders]'
            SET @ColumnName = 'created_at'
            SELECT @ConstraintName = name
                FROM sys.default_constraints
                WHERE parent_object_id = object_id(@TableName)
                    AND parent_column_id = columnproperty(object_id(@TableName), @ColumnName, 'ColumnId')
                    
            IF @ConstraintName IS NOT NULL
            BEGIN
            SELECT @Command = 'ALTER TABLE ' + @TableName + ' DROP CONSTRAINT ' + @ConstraintName  
            EXECUTE sp_executeSQL @Command
            END;
            
            ALTER TABLE  [dry_dock].[job_orders]
			ALTER column [created_at] datetimeoffset;
            ALTER TABLE [dry_dock].[job_orders] ADD  DEFAULT (GETUTCDATE()) FOR [created_at];


            SET @Command = null
			SET @ConstraintName= null
            SET @TableName = '[dry_dock].[project]'
            SET @ColumnName = 'created_at'
            SELECT @ConstraintName = name
                FROM sys.default_constraints
                WHERE parent_object_id = object_id(@TableName)
                    AND parent_column_id = columnproperty(object_id(@TableName), @ColumnName, 'ColumnId')
                    
            IF @ConstraintName IS NOT NULL
            BEGIN
            SELECT @Command = 'ALTER TABLE ' + @TableName + ' DROP CONSTRAINT ' + @ConstraintName  
            EXECUTE sp_executeSQL @Command
            END;
            
            ALTER TABLE  [dry_dock].[project]
			ALTER column [created_at] datetimeoffset;
            ALTER TABLE [dry_dock].[project] ADD  DEFAULT (GETUTCDATE()) FOR [created_at];

			ALTER TABLE  [dry_dock].[project]
			ALTER column start_date datetimeoffset;

			ALTER TABLE  [dry_dock].[project]
			ALTER column end_date datetimeoffset;


            SET @Command = null
			SET @ConstraintName= null
            SET @TableName = '[dry_dock].[project_state]'
            SET @ColumnName = 'created_at'
            SELECT @ConstraintName = name
                FROM sys.default_constraints
                WHERE parent_object_id = object_id(@TableName)
                    AND parent_column_id = columnproperty(object_id(@TableName), @ColumnName, 'ColumnId')
                    
            IF @ConstraintName IS NOT NULL
            BEGIN
            SELECT @Command = 'ALTER TABLE ' + @TableName + ' DROP CONSTRAINT ' + @ConstraintName  
            EXECUTE sp_executeSQL @Command
            END;
            
            ALTER TABLE  [dry_dock].[project_state]
			ALTER column [created_at] datetimeoffset;
            ALTER TABLE [dry_dock].[project_state] ADD  DEFAULT (GETUTCDATE()) FOR [created_at];


            SET @Command = null
			SET @ConstraintName= null
            SET @TableName = '[dry_dock].[project_type]'
            SET @ColumnName = 'created_at'
            SELECT @ConstraintName = name
                FROM sys.default_constraints
                WHERE parent_object_id = object_id(@TableName)
                    AND parent_column_id = columnproperty(object_id(@TableName), @ColumnName, 'ColumnId')
                    
            IF @ConstraintName IS NOT NULL
            BEGIN
            SELECT @Command = 'ALTER TABLE ' + @TableName + ' DROP CONSTRAINT ' + @ConstraintName  
            EXECUTE sp_executeSQL @Command
            END;
            
            ALTER TABLE  [dry_dock].[project_type]
			ALTER column [created_at] datetimeoffset;
            ALTER TABLE [dry_dock].[project_type] ADD  DEFAULT (GETUTCDATE()) FOR [created_at];


            SET @Command = null
			SET @ConstraintName= null
            SET @TableName = '[dry_dock].[specification_details]'
            SET @ColumnName = 'created_at'
            SELECT @ConstraintName = name
                FROM sys.default_constraints
                WHERE parent_object_id = object_id(@TableName)
                    AND parent_column_id = columnproperty(object_id(@TableName), @ColumnName, 'ColumnId')
                    
            IF @ConstraintName IS NOT NULL
            BEGIN
            SELECT @Command = 'ALTER TABLE ' + @TableName + ' DROP CONSTRAINT ' + @ConstraintName  
            EXECUTE sp_executeSQL @Command
            END;
            
            ALTER TABLE  [dry_dock].[specification_details]
			ALTER column [created_at] datetimeoffset;
            ALTER TABLE [dry_dock].[specification_details] ADD  DEFAULT (GETUTCDATE()) FOR [created_at];


            SET @Command = null
			SET @ConstraintName= null
            SET @TableName = '[dry_dock].[specification_details_sub_item]'
            SET @ColumnName = 'created_at'
            SELECT @ConstraintName = name
                FROM sys.default_constraints
                WHERE parent_object_id = object_id(@TableName)
                    AND parent_column_id = columnproperty(object_id(@TableName), @ColumnName, 'ColumnId')
                    
            IF @ConstraintName IS NOT NULL
            BEGIN
            SELECT @Command = 'ALTER TABLE ' + @TableName + ' DROP CONSTRAINT ' + @ConstraintName  
            EXECUTE sp_executeSQL @Command
            END;
            
            ALTER TABLE  [dry_dock].[specification_details_sub_item]
			ALTER column [created_at] datetimeoffset;
            ALTER TABLE [dry_dock].[specification_details_sub_item] ADD  DEFAULT (GETUTCDATE()) FOR [created_at];

			ALTER TABLE  [dry_dock].[specification_details_sub_item]
			ALTER column updated_at datetimeoffset;

			ALTER TABLE  [dry_dock].[specification_details_sub_item]
			ALTER column deleted_at datetimeoffset;


            SET @Command = null
			SET @ConstraintName= null
            SET @TableName = '[dry_dock].[standard_jobs_sub_items]'
            SET @ColumnName = 'created_at'
            SELECT @ConstraintName = name
                FROM sys.default_constraints
                WHERE parent_object_id = object_id(@TableName)
                    AND parent_column_id = columnproperty(object_id(@TableName), @ColumnName, 'ColumnId')
                    
            IF @ConstraintName IS NOT NULL
            BEGIN
            SELECT @Command = 'ALTER TABLE ' + @TableName + ' DROP CONSTRAINT ' + @ConstraintName  
            EXECUTE sp_executeSQL @Command
            END;
            
            ALTER TABLE  [dry_dock].[standard_jobs_sub_items]
			ALTER column [created_at] datetimeoffset;
            ALTER TABLE [dry_dock].[standard_jobs_sub_items] ADD  DEFAULT (GETUTCDATE()) FOR [created_at];

			ALTER TABLE  [dry_dock].[standard_jobs_sub_items]
			ALTER column updated_at datetimeoffset;

			ALTER TABLE  [dry_dock].[standard_jobs_sub_items]
			ALTER column deleted_at datetimeoffset;


            SET @Command = null
			SET @ConstraintName= null
            SET @TableName = '[dry_dock].[statement_of_facts]'
            SET @ColumnName = 'created_at'
            SELECT @ConstraintName = name
                FROM sys.default_constraints
                WHERE parent_object_id = object_id(@TableName)
                    AND parent_column_id = columnproperty(object_id(@TableName), @ColumnName, 'ColumnId')
                    
            IF @ConstraintName IS NOT NULL
            BEGIN
            SELECT @Command = 'ALTER TABLE ' + @TableName + ' DROP CONSTRAINT ' + @ConstraintName  
            EXECUTE sp_executeSQL @Command
            END;
            
            ALTER TABLE  [dry_dock].[statement_of_facts]
			ALTER column [created_at] datetimeoffset;
            ALTER TABLE [dry_dock].[statement_of_facts] ADD  DEFAULT (GETUTCDATE()) FOR [created_at];


            SET @Command = null
			SET @ConstraintName= null
            SET @TableName = '[dry_dock].[yards_projects]'
            SET @ColumnName = 'created_at'
            SELECT @ConstraintName = name
                FROM sys.default_constraints
                WHERE parent_object_id = object_id(@TableName)
                    AND parent_column_id = columnproperty(object_id(@TableName), @ColumnName, 'ColumnId')
                    
            IF @ConstraintName IS NOT NULL
            BEGIN
            SELECT @Command = 'ALTER TABLE ' + @TableName + ' DROP CONSTRAINT ' + @ConstraintName  
            EXECUTE sp_executeSQL @Command
            END;
            
            ALTER TABLE  [dry_dock].[yards_projects]
			ALTER column [created_at] datetimeoffset;
            ALTER TABLE [dry_dock].[yards_projects] ADD  DEFAULT (GETUTCDATE()) FOR [created_at];

			ALTER TABLE  [dry_dock].[yards_projects]
			ALTER column updated_at datetimeoffset;

			ALTER TABLE  [dry_dock].[yards_projects]
			ALTER column deleted_at datetimeoffset;

            ALTER TABLE  [dry_dock].[yards_projects]
			ALTER column last_exported_date datetimeoffset;
            `);

            await MigrationUtilsService.migrationLog(this.name, '', 'S', 'dry_dock', this.description);
        } catch (e) {
            const error = JSON.stringify(e);
            await MigrationUtilsService.migrationLog(this.name, error, 'E', 'dry_dock', this.description, true);
        }
    }

    public async down(): Promise<void> {}
}
