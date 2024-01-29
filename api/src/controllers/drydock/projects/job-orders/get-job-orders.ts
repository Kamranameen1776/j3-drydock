import { Request, Response } from 'express';
import { Body, Controller, Post } from 'tsoa';

import { GetJobOrdersQuery } from '../../../../application-layer/drydock/projects/job-orders/GetJobOrdersQuery';
import { MiddlewareHandler } from '../../../../controllers/drydock/core/middleware/MiddlewareHandler';
import { IJobOrderDto } from '../../../../dal/drydock/projects/job-orders/IJobOrderDto';
import { ODataResult } from '../../../../shared/interfaces';

/**
 * This handler returns all available shipments
 * GET /drydock/example-projects
 * @exports
 * @param {Request} req Express request
 * @param {Response} res Express response
 */
async function getJobOrders(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request) => {
        const result = await new GetJobOrdersController().getJobOrders(request);

        return result;
    });
}

exports.post = getJobOrders;

// @Route('drydock/projects/job-orders/get-job-orders')
export class GetJobOrdersController extends Controller {
    @Post()
    public async getJobOrders(@Body() request: Request): Promise<ODataResult<IJobOrderDto>> {
        const query = new GetJobOrdersQuery();

        const result = await query.ExecuteAsync(request);

        return result;
    }
}
