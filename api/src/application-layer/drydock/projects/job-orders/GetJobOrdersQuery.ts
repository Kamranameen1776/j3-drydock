import { Query } from '../../../../application-layer/drydock/core/cqrs/Query';
import { Req } from '../../../../common/drydock/ts-helpers/req-res';
import { IJobOrderDto } from '../../../../dal/drydock/projects/job-orders/IJobOrderDto';
import { JobOrdersRepository } from '../../../../dal/drydock/projects/job-orders/JobOrdersRepository';
import { ODataBodyDto } from '../../../../shared/dto';
import { ODataResult } from '../../../../shared/interfaces';

export class GetJobOrdersQuery extends Query<Req<ODataBodyDto>, ODataResult<IJobOrderDto>> {
    repository: JobOrdersRepository;

    constructor() {
        super();
        this.repository = new JobOrdersRepository();
    }

    protected async AuthorizationHandlerAsync(): Promise<void> {
        return;
    }

    /**
     * @returns All Job Orders(specifications) by project
     */
    protected async MainHandlerAsync(request: Req<ODataBodyDto>): Promise<ODataResult<IJobOrderDto>> {
        const data = await this.repository.GetJobOrders(request);

        return data;
    }
}
