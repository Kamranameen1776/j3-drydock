import { MigrationUtilsService } from "j2utils";
import {MigrationInterface, QueryRunner} from "typeorm";

export class functionCodeOfSpecification1701778754100 implements MigrationInterface {
    public className = this.constructor.name;
    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await MigrationUtilsService.createTableBackup('INF_Lib_Function');

            await queryRunner.query(`
            Declare @maxfunction_id int
            Select @maxfunction_id = ISNULL(MAX(FunctionId),0)  from INF_Lib_Function
            MERGE INTO INF_Lib_Function AS TARGET USING (
            VALUES
            (@maxfunction_id+1, N'660941D8-B00B-4C58-AD32-1F0A144B1C88', N'project', N'specification_details', N'Specification Details', 1, getdate(), NULL, NULL, 1, N'project', N'crew', N'specification_attachment'),
            (@maxfunction_id+2, N'F55BD1B9-7949-48A6-BAB2-C6255527883F', N'project', N'specification_index', N'Specification Main', 1, getdate(), NULL, NULL, 1, N'project', N'crew', N'spec_main')                
            )
                        
            AS SOURCE ([FunctionId], [Function_UID], [Module_Code], [Function_Code], [Function_Name], [Created_By], [Date_Of_Creation], [Modified_By], [Date_Of_Modification], [Active_Status], [parent_function_code], [parent_module_code], [attach_prefix])
                        
            ON TARGET.[Function_UID] = SOURCE.[Function_UID]
                        
            WHEN MATCHED THEN
            UPDATE SET TARGET.[FunctionId] = SOURCE.[FunctionId], TARGET.[Module_Code] = SOURCE.[Module_Code], TARGET.[Function_Name] = SOURCE.[Function_Name], [Modified_By] = 1, [Date_Of_Modification] = GETDATE(), TARGET.[Active_Status] = SOURCE.[Active_Status], TARGET.[parent_function_code] = SOURCE.[parent_function_code], 
            TARGET.[parent_module_code] = SOURCE.[parent_module_code], TARGET.[attach_prefix] = SOURCE.[attach_prefix]
                        
            WHEN NOT MATCHED BY TARGET THEN
            INSERT ([FunctionId], [Function_UID], [Module_Code], [Function_Code], [Function_Name], [Created_By], [Date_Of_Creation], [Modified_By], [Date_Of_Modification], [Active_Status], [parent_function_code], [parent_module_code], [attach_prefix])
            VALUES (SOURCE.[FunctionId], SOURCE.[Function_UID], SOURCE.[Module_Code], SOURCE.[Function_Code], SOURCE.[Function_Name], SOURCE.[Created_By], SOURCE.[Date_Of_Creation], SOURCE.[Modified_By], SOURCE.[Date_Of_Modification], SOURCE.[Active_Status], SOURCE.[parent_function_code],
            SOURCE.[parent_module_code], SOURCE.[attach_prefix]);
            `);

            await MigrationUtilsService.migrationLog(
                this.className,
                '',
                'S',
                'dry_dock',
                'specification function code',
            );

        } catch (error) {
            await MigrationUtilsService.migrationLog(
                this.className,
                JSON.stringify(error),
                'E',
                'dry_dock',
                'specification function code',
                true,
            );
        }
    }
    public async down(queryRunner: QueryRunner): Promise<void> {}
}


