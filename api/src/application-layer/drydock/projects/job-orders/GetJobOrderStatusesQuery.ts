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

    protected async ValidationHandlerAsync(): Promise<void> {
        return;
    }

    /**
     * @returns All Job Order Statuses
     */
    protected async MainHandlerAsync(): Promise<KeyValuePair<string, string>[]> {
        const arr: KeyValuePair<string, string>[] = [];

        // TODO: check if it is needed to load statuses from the Jibe library
        Object.keys(JobOrderStatus).forEach((key) => {
            const value = JobOrderStatus[key as keyof typeof JobOrderStatus];
            arr.push({ Key: key, Value: value });
        });

        return arr;
    }
}
