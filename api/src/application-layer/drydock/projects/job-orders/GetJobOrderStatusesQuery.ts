import { Request } from 'express';

import { KeyValuePair } from '../../../../common/drydock/ts-helpers/KeyValuePair';
import { JobOrdersRepository } from '../../../../dal/drydock/projects/job-orders/JobOrdersRepository';
import { JobOrderStatus } from '../../../../dal/drydock/projects/job-orders/JobOrderStatus';
import { Query } from '../../core/cqrs/Query';

export class GetJobOrderStatusesQuery extends Query<void, KeyValuePair<string, string>[]> {
    repository: JobOrdersRepository;

    constructor() {
        super();
        this.repository = new JobOrdersRepository();
    }

    protected async AuthorizationHandlerAsync(): Promise<void> {
        return;
    }

    protected async ValidationHandlerAsync(request: Request): Promise<void> { }

    /**
     * @returns All specification details
     */
    protected async MainHandlerAsync(request: Request): Promise<KeyValuePair<string, string>[]> {
        const arr: KeyValuePair<string, string>[] = [];

        Object.keys(JobOrderStatus).forEach((key) => {
            const value = JobOrderStatus[key];
            arr.push({ Key: key, Value: value });
        });

        return arr;
    }
}
