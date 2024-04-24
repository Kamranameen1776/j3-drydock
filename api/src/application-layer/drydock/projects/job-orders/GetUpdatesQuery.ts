import { Req } from '../../../../common/drydock/ts-helpers/req-res';
import { IJobOrderDto } from '../../../../dal/drydock/projects/job-orders/IJobOrderDto';
import { JobOrdersRepository } from '../../../../dal/drydock/projects/job-orders/JobOrdersRepository';
import { ODataResult } from '../../../../shared/interfaces';
import { Query } from '../../core/cqrs/Query';
import { GetJobOrdersDto } from './dtos/GetJobOrdersDto';

export class GetUpdatesQuery extends Query<Req<GetJobOrdersDto>, ODataResult<IJobOrderDto>> {
    repository: JobOrdersRepository;

    constructor() {
        super();
        this.repository = new JobOrdersRepository();
    }

    protected async MainHandlerAsync(request: Req<GetJobOrdersDto>): Promise<ODataResult<IJobOrderDto>> {
        return this.repository.GetUpdates(request);
    }
}
