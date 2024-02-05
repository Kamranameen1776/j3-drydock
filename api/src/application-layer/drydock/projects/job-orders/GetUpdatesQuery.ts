import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Request } from 'express';

import { Query } from '../../../../application-layer/drydock/core/cqrs/Query';
import { IJobOrderDto } from '../../../../dal/drydock/projects/job-orders/IJobOrderDto';
import { JobOrdersRepository } from '../../../../dal/drydock/projects/job-orders/JobOrdersRepository';
import { ODataResult } from '../../../../shared/interfaces';
import { GetJobOrdersDto } from './dtos/GetJobOrdersDto';
import { Req } from '../../../../common/drydock/ts-helpers/req-res';

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
