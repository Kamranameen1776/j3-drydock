import { plainToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { AccessRights } from 'j2utils';
import { Body, Controller, Post, Route } from 'tsoa';

import { UpdateJobOrderQuery } from '../../../../application-layer/drydock/projects/job-orders/UpdateJobOrderQuery';
import { UpdateJobOrderDto } from '../../../../dal/drydock/projects/job-orders/UpdateJobOrderDto';
import { MiddlewareHandler } from '../../core/middleware/MiddlewareHandler';

@Route('drydock/projects/job-orders/update-job-order')
export class UpdateJobOrderController extends Controller {
    @Post()
    public async updateJobOrder(@Body() dto: UpdateJobOrderDto): Promise<void> {
        const query = new UpdateJobOrderQuery();

        return query.ExecuteAsync(dto);
    }
}

exports.post = new MiddlewareHandler().ExecuteHandlerAsync(async (request: Request) => {
    const dto = plainToClass(UpdateJobOrderDto, request.body);
    const { UserUID: createdBy } = AccessRights.authorizationDecode(request);

    dto.CreatedBy = createdBy;

    return new UpdateJobOrderController().updateJobOrder(dto);
});
