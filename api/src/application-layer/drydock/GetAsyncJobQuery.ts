import { AsyncJobsRepository } from '../../dal/drydock/async-jobs/AsyncJobsRepository';
import { AsyncJobsEntity } from '../../entity/drydock/AsyncJobsEntity';
import { Query } from './core/cqrs/Query';

export class GetAsyncJobQuery extends Query<string, AsyncJobsEntity | undefined> {
    asyncJobRepository = new AsyncJobsRepository();

    public async MainHandlerAsync(uid: string) {
        return this.asyncJobRepository.GetAsyncJob(uid);
    }
}
