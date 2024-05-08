import { MigrationUtilsService } from 'j2utils';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { errorLikeToString } from '../../common/drydock/ts-helpers/error-like-to-string';

export class AddParentFunctionForSpecificationDetailsFunction1702636460207 implements MigrationInterface {
    public className = this.constructor.name;
    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.query(`
            IF EXISTS(SELECT 1 FROM sys.objects WHERE object_id = OBJECT_ID(N'INF_Lib_Function') AND type in (N'U'))
            BEGIN
              EXEC [inf].[utils_inf_backup_table] 'INF_Lib_Function'
            END
            `);

            await queryRunner.query(`
            Declare @maxfunction_id int
            Select @maxfunction_id = ISNULL(MAX(FunctionId),0)  from INF_Lib_Function
            MERGE INTO INF_Lib_Function AS TARGET USING (
            VALUES
                (@maxfunction_id+1, N'28866419-0961-4055-92F8-CEEDDA1BB70F', N'project_main', N'specification', N'Specification', 1, getdate(), NULL, NULL, 1, null, N'project_main', null)
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

            await MigrationUtilsService.migrationLog(this.className, '', 'S', 'spec', 'spec function code');
        } catch (error) {
            await MigrationUtilsService.migrationLog(
                this.className,
                errorLikeToString(error),
                'E',
                'spec',
                'spec function code',
                true,
            );
        }
    }
    public async down(queryRunner: QueryRunner): Promise<void> {}
}
