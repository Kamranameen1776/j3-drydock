import { Req } from '../../../../common/drydock/ts-helpers/req-res';
import { IJobOrderDto } from '../../../../dal/drydock/projects/job-orders/IJobOrderDto';
import { JobOrdersRepository } from '../../../../dal/drydock/projects/job-orders/JobOrdersRepository';
import { ODataBodyDto } from '../../../../shared/dto';
import { ODataResult } from '../../../../shared/interfaces';
import { Query } from '../../core/cqrs/Query';

export class GetJobOrdersQuery extends Query<Req<ODataBodyDto>, ODataResult<IJobOrderDto>> {
    repository: JobOrdersRepository;

    constructor() {
        super();
        this.repository = new JobOrdersRepository();
    }

    /**
     * @returns All Job Orders(specifications) by project
     */
    protected async MainHandlerAsync(request: Req<ODataBodyDto>): Promise<ODataResult<IJobOrderDto>> {
        return this.repository.GetJobOrders(request);
    }
}
