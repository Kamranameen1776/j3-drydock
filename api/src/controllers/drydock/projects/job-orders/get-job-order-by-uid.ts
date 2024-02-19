import { Request } from 'express';
import { Body, Controller, Post, Route } from 'tsoa';

import { GetJobOrderByUidDto } from '../../../../application-layer/drydock/projects/job-orders/dtos/GetJobOrderByUidDto';
import { JobOrderDto } from '../../../../application-layer/drydock/projects/job-orders/dtos/JobOrderDto';
import { GetJobOrderByUidQuery } from '../../../../application-layer/drydock/projects/job-orders/GetJobOrderByUidQuery';
import { MiddlewareHandler } from '../../core/middleware/MiddlewareHandler';

@Route('drydock/projects/job-orders/get-job-order-by-uid')
export class GetJobOrderBySpecificationController extends Controller {
    @Post()
    public async getJobOrderBySpecification(@Body() dto: GetJobOrderByUidDto): Promise<JobOrderDto | null> {
        const query = new GetJobOrderByUidQuery();

        const result = await query.ExecuteAsync(dto);

        return result;
    }
}

exports.post = new MiddlewareHandler().ExecuteHandlerAsync(async (request: Request) => {
    return new GetJobOrderBySpecificationController().getJobOrderBySpecification(request.body);
});
