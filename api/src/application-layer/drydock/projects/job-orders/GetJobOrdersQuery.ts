import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Request } from 'express';

import { Query } from '../../../../application-layer/drydock/core/cqrs/Query';
import { IJobOrderDto } from '../../../../dal/drydock/projects/job-orders/IJobOrderDto';
import { JobOrdersRepository } from '../../../../dal/drydock/projects/job-orders/JobOrdersRepository';
import { ODataResult } from '../../../../shared/interfaces';
import { GetJobOrdersDto } from './dtos/GetJobOrdersDto';

export class GetJobOrdersQuery extends Query<Request, ODataResult<IJobOrderDto>> {
    repository: JobOrdersRepository;

    constructor() {
        super();
        this.repository = new JobOrdersRepository();
    }

    protected async AuthorizationHandlerAsync(): Promise<void> {
        return;
    }

    protected async ValidationHandlerAsync(request: Request): Promise<void> {
        if (!request) {
            throw new Error('Request is null');
        }

        const createProjectDto: GetJobOrdersDto = plainToClass(GetJobOrdersDto, request.body);

        const result = await validate(createProjectDto);

        if (result.length) {
            throw result;
        }
    }

    /**
     * @returns All Job Orders(specifications) by project
     */
    protected async MainHandlerAsync(request: Request): Promise<ODataResult<IJobOrderDto>> {
        const data = await this.repository.GetJobOrders(request);

        return data;
    }
}
