import { getConnection } from 'typeorm';

import { TransactionException } from '../../../../bll/drydock/core/exceptions/TransactionException';

type Work<TResult> = () => Promise<TResult>;

export class UnitOfWork {
    public async ExecuteAsync<TResult>(work: Work<TResult>): Promise<TResult | never> {
        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();

        let result: TResult;

        try {
            queryRunner.startTransaction();

            result = await work();

            queryRunner.commitTransaction();
        } catch (exception) {
            queryRunner.rollbackTransaction();

            // TODO: implement retry pattern
            // TODO: implement logging
            throw new TransactionException('Db transaction failed');
        } finally {
            queryRunner.release();
        }

        return result;
    }
}
