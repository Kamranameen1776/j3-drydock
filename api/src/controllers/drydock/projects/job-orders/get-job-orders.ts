import * as express from 'express';
import { Body, Controller, Post, Request, Route } from 'tsoa';

import { OdataRequest } from '../../../../application-layer/drydock/core/cqrs/odata/OdataRequest';
import { GetJobOrdersQuery } from '../../../../application-layer/drydock/projects/job-orders/GetJobOrdersQuery';
import { MiddlewareHandler } from '../../../../controllers/drydock/core/middleware/MiddlewareHandler';
import { IJobOrderDto } from '../../../../dal/drydock/projects/job-orders/IJobOrderDto';
import { ODataBodyDto } from '../../../../shared/dto';
import { ODataResult } from '../../../../shared/interfaces';

async function getJobOrders(req: express.Request, res: express.Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request) => {
        const result = await new GetJobOrdersController().getJobOrders(request, req.body.odata);

        return result;
    });
}

exports.post = getJobOrders;

@Route('drydock/projects/job-orders/get-job-orders')
export class GetJobOrdersController extends Controller {
    @Post()
    public async getJobOrders(
        @Request() request: express.Request,
        @Body() odata: ODataBodyDto,
    ): Promise<ODataResult<IJobOrderDto>> {
        const query = new GetJobOrdersQuery();

        const result = await query.ExecuteAsync(new OdataRequest(odata, request));
        return result;
    }
}
