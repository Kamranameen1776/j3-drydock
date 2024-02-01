import { plainToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { Body, Controller, Post, Route } from 'tsoa';

import { UpdateJobOrderStartEndDateDto } from '../../../../application-layer/drydock/projects/job-orders/dtos/UpdateJobOrderStartEndDateDto';
import { UpdateJobOrderDurationCommand } from '../../../../application-layer/drydock/projects/job-orders/UpdateJobOrderDurationCommand';
import { MiddlewareHandler } from '../../core/middleware/MiddlewareHandler';

async function updateJobOrderDuration(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request) => {
        const dto = plainToClass(UpdateJobOrderStartEndDateDto, request.body);

        return new UpdateJobOrderDurationController().updateJobOrderDuration(dto);
    });
}

exports.post = updateJobOrderDuration;

@Route('drydock/projects/job-orders/update-job-order-duration')
export class UpdateJobOrderDurationController extends Controller {
    @Post()
    public async updateJobOrderDuration(@Body() dto: UpdateJobOrderStartEndDateDto): Promise<void> {
        const query = new UpdateJobOrderDurationCommand();

        const result = await query.ExecuteAsync(dto);

        return result;
    }
}
