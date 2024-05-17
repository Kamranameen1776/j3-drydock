import { Request } from 'express';
import { Body, Controller, Post, Route } from 'tsoa';

import { GetJobOrderBySpecificationDto } from '../../../../application-layer/drydock/projects/job-orders/dtos/GetJobOrderBySpecificationDto';
import { JobOrderDto } from '../../../../application-layer/drydock/projects/job-orders/dtos/JobOrderDto';
import { GetAllJobOrdersBySpecificationUidQuery } from '../../../../application-layer/drydock/projects/job-orders/GetAllJobOrdersBySpecificationUidQuery';
import { MiddlewareHandler } from '../../core/middleware/MiddlewareHandler';

@Route('drydock/projects/job-orders/get-job-order-by-specification-uid')
export class GetJobOrderBySpecificationController extends Controller {
    @Post()
    public async getJobOrderBySpecification(@Body() dto: GetJobOrderBySpecificationDto): Promise<JobOrderDto[] | null> {
        const query = new GetAllJobOrdersBySpecificationUidQuery();

        return query.ExecuteAsync(dto);
    }
}

exports.post = new MiddlewareHandler().ExecuteHandlerAsync(async (request: Request) => {
    return new GetJobOrderBySpecificationController().getJobOrderBySpecification(request.body);
});
