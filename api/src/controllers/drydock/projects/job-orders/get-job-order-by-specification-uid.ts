import { Request } from 'express';
import { Body, Controller, Post, Route } from 'tsoa';

import { GetLatestJobOrderBySpecificationDto } from '../../../../application-layer/drydock/projects/job-orders/dtos/GetLatestJobOrderBySpecificationDto';
import { JobOrderDto } from '../../../../application-layer/drydock/projects/job-orders/dtos/JobOrderDto';
import { GetJobOrderBySpecificationUidQuery } from '../../../../application-layer/drydock/projects/job-orders/GetJobOrderBySpecificationUidQuery';
import { MiddlewareHandler } from '../../core/middleware/MiddlewareHandler';

@Route('drydock/projects/job-orders/get-job-order-by-specification-uid')
export class GetJobOrderBySpecificationController extends Controller {
    @Post()
    public async getJobOrderBySpecification(
        @Body() dto: GetLatestJobOrderBySpecificationDto,
    ): Promise<JobOrderDto | null> {
        const query = new GetJobOrderBySpecificationUidQuery();

        return query.ExecuteAsync(dto);
    }
}

exports.post = new MiddlewareHandler().ExecuteHandlerAsync(async (request: Request) => {
    return new GetJobOrderBySpecificationController().getJobOrderBySpecification(request.body);
});
