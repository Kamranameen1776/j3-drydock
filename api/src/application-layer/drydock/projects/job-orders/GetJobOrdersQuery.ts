import { Query } from '../../../../application-layer/drydock/core/cqrs/Query';
import { IJobOrderDto } from '../../../../dal/drydock/projects/job-orders/IJobOrderDto';
import { JobOrdersRepository } from '../../../../dal/drydock/projects/job-orders/JobOrdersRepository';
import { ODataResult } from '../../../../shared/interfaces';
import { OdataRequest } from '../../core/cqrs/odata/OdataRequest';

export class GetJobOrdersQuery extends Query<OdataRequest, ODataResult<IJobOrderDto>> {
    repository: JobOrdersRepository;

    constructor() {
        super();
        this.repository = new JobOrdersRepository();
    }

    protected async AuthorizationHandlerAsync(): Promise<void> {
        return;
    }

    protected async ValidationHandlerAsync(request: OdataRequest): Promise<void> {
        return;
    }

    /**
     * @returns All Job Orders(specifications) by project
     */
    protected async MainHandlerAsync(request: OdataRequest): Promise<ODataResult<IJobOrderDto>> {
        const data = await this.repository.GetJobOrders(request.request);

        return data;
    }
}
