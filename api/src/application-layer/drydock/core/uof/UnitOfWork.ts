import { getConnection } from 'typeorm';
import { QueryRunner } from 'typeorm/query-runner/QueryRunner';

type Work<TResult> = (queryRunner: QueryRunner) => Promise<TResult>;

export class UnitOfWork {
    public async ExecuteAsync<TResult>(work: Work<TResult>): Promise<TResult | never> {
        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();

        let result: TResult;

        try {
            await queryRunner.startTransaction();

            result = await work(queryRunner);

            await queryRunner.commitTransaction();
        } catch (exception) {
            await queryRunner.rollbackTransaction();

            // TODO: implement retry pattern
            throw exception;
        } finally {
            await queryRunner.release();
        }

        return result;
    }
}
