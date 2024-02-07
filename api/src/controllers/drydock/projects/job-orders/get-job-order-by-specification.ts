import { Request } from 'express';
import { Body, Controller, Post, Route } from 'tsoa';

import { GetJobOrderBySpecificationDto } from '../../../../application-layer/drydock/projects/job-orders/dtos/GetJobOrderBySpecificationDto';
import { JobOrderDto } from '../../../../application-layer/drydock/projects/job-orders/dtos/JobOrderDto';
import { GetJobOrderBySpecificationQuery } from '../../../../application-layer/drydock/projects/job-orders/GetJobOrderBySpecificationQuery';
import { MiddlewareHandler } from '../../core/middleware/MiddlewareHandler';

@Route('drydock/projects/job-orders/get-job-order-by-specification')
export class GetJobOrderBySpecificationController extends Controller {
    @Post()
    public async getJobOrderBySpecification(@Body() dto: GetJobOrderBySpecificationDto): Promise<JobOrderDto | null> {
        const query = new GetJobOrderBySpecificationQuery();

        const result = await query.ExecuteAsync(dto);

        return result;
    }
}

exports.post = new MiddlewareHandler().ExecuteHandlerAsync(async (request: Request) => {
    return new GetJobOrderBySpecificationController().getJobOrderBySpecification(request.body);
});
