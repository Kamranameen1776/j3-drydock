import { Request, Response } from 'express';
import { Controller, Get, Route } from 'tsoa';

import { GetJobOrderStatusesQuery } from '../../../../application-layer/drydock/projects/job-orders/GetJobOrderStatusesQuery';
import { KeyValuePair } from '../../../../common/drydock/ts-helpers/KeyValuePair';
import { MiddlewareHandler } from '../../core/middleware/MiddlewareHandler';

@Route('drydock/projects/job-orders/get-job-order-statuses')
export class GetJobOrderStatusesController extends Controller {
    @Get()
    public async getJobOrderStatuses(): Promise<KeyValuePair<string, string>[]> {
        const query = new GetJobOrderStatusesQuery();

        const result = await query.ExecuteAsync();

        return result;
    }
}

exports.get = new MiddlewareHandler().ExecuteHandlerAsync(new GetJobOrderStatusesController().getJobOrderStatuses);
