import { getRepository } from 'typeorm';

import { AsyncJobsEntity } from '../../../entity/drydock/AsyncJobsEntity';

export class AsyncJobsRepository {
    public async CreateAsyncJob(uid: string, topic: string, createdAt: Date, createdBy?: string) {
        return getRepository(AsyncJobsEntity).insert({
            uid: uid,
            ModuleCode: 'dry_dock',
            FunctionCode: 'project',
            Topic: topic,
            Status: 0,
            modified_by: createdBy,
            modified_at: createdAt,
        });
    }

    public async UpdateAsyncJob(uid: string, status: number, modified_at: Date) {
        return getRepository(AsyncJobsEntity).update(uid, { Status: status, modified_at });
    }

    public async GetAsyncJob(uid: string) {
        return getRepository(AsyncJobsEntity).findOne(uid);
    }
}
