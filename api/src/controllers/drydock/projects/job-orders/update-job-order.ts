import { plainToClass } from 'class-transformer';
import { Request } from 'express';
import { Body, Controller, Post, Route } from 'tsoa';

import { UpdateJobOrderQuery } from '../../../../application-layer/drydock/projects/job-orders/UpdateJobOrderQuery';
import { UpdateJobOrderDto } from '../../../../dal/drydock/projects/job-orders/UpdateJobOrderDto';
import { MiddlewareHandler } from '../../core/middleware/MiddlewareHandler';

@Route('drydock/projects/job-orders/update-job-order')
export class UpdateJobOrderController extends Controller {
    @Post()
    public async updateJobOrder(@Body() dto: UpdateJobOrderDto): Promise<void> {
        const query = new UpdateJobOrderQuery();

        const result = await query.ExecuteAsync(dto);

        return result;
    }
}

exports.post = new MiddlewareHandler().ExecuteHandlerAsync(async (request: Request) => {
    return new UpdateJobOrderController().updateJobOrder(plainToClass(UpdateJobOrderDto, request.body));
});
