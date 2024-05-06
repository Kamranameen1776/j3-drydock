import { plainToClass } from 'class-transformer';
import { Request } from 'express';
import { Body, Controller, Post, Route } from 'tsoa';

import { UpdateJobOrderStartEndDateDto } from '../../../../application-layer/drydock/projects/job-orders/dtos/UpdateJobOrderStartEndDateDto';
import { UpdateJobOrderDurationCommand } from '../../../../application-layer/drydock/projects/job-orders/UpdateJobOrderDurationCommand';
import { MiddlewareHandler } from '../../core/middleware/MiddlewareHandler';

@Route('drydock/projects/job-orders/update-job-order-duration')
export class UpdateJobOrderDurationController extends Controller {
    @Post()
    public async updateJobOrderDuration(@Body() dto: UpdateJobOrderStartEndDateDto): Promise<void> {
        const query = new UpdateJobOrderDurationCommand();

        const result = await query.ExecuteAsync(dto);

        return result;
    }
}

exports.post = new MiddlewareHandler().ExecuteHandlerAsync(async (request: Request) => {
    return new UpdateJobOrderDurationController().updateJobOrderDuration(
        plainToClass(UpdateJobOrderStartEndDateDto, request.body),
    );
});
