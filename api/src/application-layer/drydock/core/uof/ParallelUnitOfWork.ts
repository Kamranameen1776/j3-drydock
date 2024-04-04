import { getConnection } from 'typeorm';
import { QueryRunner } from 'typeorm/query-runner/QueryRunner';

export class QueryRunnerManager {
    queryRunners: QueryRunner[];
    private i = 0;
    private amount: number;

    constructor(amount: number) {
        this.amount = amount;
        this.queryRunners = new Array(amount).fill(0).map(() => getConnection().createQueryRunner());
    }

    public get runner() {
        return this.queryRunners[this.i++ % this.amount];
    }
}

type ParallelWork<TResult> = (queryRunner: QueryRunnerManager) => Promise<TResult>;

export class ParallelUnitOfWork {
    public async ExecuteAsync<TResult>(work: ParallelWork<TResult>, amount = 2): Promise<TResult | never> {
        const queryRunnerManager = new QueryRunnerManager(amount);
        let result: TResult;

        try {
            await Promise.all(queryRunnerManager.queryRunners.map((queryRunner) => queryRunner.startTransaction()));

            result = await work(queryRunnerManager);

            await Promise.all(queryRunnerManager.queryRunners.map((queryRunner) => queryRunner.commitTransaction()));
        } catch (exception) {
            // Check if all queryRunners is not pending
            await Promise.allSettled(
                queryRunnerManager.queryRunners.map((queryRunner) =>
                    queryRunner.manager.createQueryBuilder().select('1').execute(),
                ),
            );
            await Promise.all(queryRunnerManager.queryRunners.map((queryRunner) => queryRunner.rollbackTransaction()));

            // TODO: implement retry pattern
            throw exception;
        } finally {
            await Promise.all(queryRunnerManager.queryRunners.map((queryRunner) => queryRunner.release()));
        }

        return result;
    }
}
