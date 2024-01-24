import { MigrationUtilsService } from 'j2utils';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { errorLikeToString } from '../../common/drydock/ts-helpers/error-like-to-string';

/** @private */
const enum Status {
    Success = 'S',
    Error = 'E',
}

/**
 * This migration is a direct continuation of {@link updatingAttachPrefixOfDryDockSpecAndStandardJobs1703248160022}
 */
export class SetAttachPrefixOfDryDockSpecAndStandardJobsByCode1706008729054 implements MigrationInterface {
    public readonly name = this.constructor.name;
    protected readonly moduleCode = 'project';
    public readonly description = `Set attach_prefix for functions in "${this.moduleCode}" module`;

    protected async log(status: Status, message = this.description): Promise<void> {
        const deleteMigration = status === Status.Error;
        const functionCode = null as unknown as string;

        await MigrationUtilsService.migrationLog(
            this.name,
            message,
            status,
            this.moduleCode,
            functionCode,
            deleteMigration,
        );
    }

    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.query(
                `
                merge into
                    INF_Lib_Function as target
                using (
                    values (
                        'specification_details',
                        'projspec'
                    ), (
                        'dry_dock',
                        'projdrydock'
                    ), (
                        'standard_job',
                        'projstandard'
                    )
                )
                    as source (
                        Function_Code,
                        attach_prefix
                    )

                on
                    target.[Module_Code] = @0
                    and
                    target.[Function_Code] = source.[Function_Code]

                when matched then
                    update
                        set
                            target.[attach_prefix] = source.[attach_prefix],
                            target.[Modified_By] = 1,
                            target.[Date_Of_Modification] = GETDATE()
            `,
                [this.moduleCode],
            );

            await this.log(Status.Success);
        } catch (error) {
            await this.log(Status.Error, errorLikeToString(error));
        }
    }

    public async down(): Promise<void> {}
}
