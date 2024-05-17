import * as express from 'express';
import { Body, Controller, Post, Request, Route } from 'tsoa';

import { GetJobOrdersQuery } from '../../../../application-layer/drydock/projects/job-orders/GetJobOrdersQuery';
import { Req } from '../../../../common/drydock/ts-helpers/req-res';
import { IJobOrderDto } from '../../../../dal/drydock/projects/job-orders/IJobOrderDto';
import { ODataBodyDto } from '../../../../shared/dto';
import { ODataResult } from '../../../../shared/interfaces';
import { MiddlewareHandler } from '../../core/middleware/MiddlewareHandler';

@Route('drydock/projects/job-orders/get-job-orders')
export class GetJobOrdersController extends Controller {
    @Post()
    public async getJobOrders(
        @Request() request: Req<ODataBodyDto>,
        @Body() odataBody: ODataBodyDto,
    ): Promise<ODataResult<IJobOrderDto>> {
        const query = new GetJobOrdersQuery();

        return query.ExecuteAsync(request, ODataBodyDto);
    }
}

exports.post = new MiddlewareHandler().ExecuteHandlerAsync(async (request: express.Request) => {
    return new GetJobOrdersController().getJobOrders(request, request.body);
});
