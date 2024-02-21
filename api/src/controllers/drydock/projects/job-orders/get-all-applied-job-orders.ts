import { Request, Response } from 'express';

import { GetAllAppliedJobOrdersQuery } from '../../../../application-layer/drydock/projects/job-orders/GetAllAppliedJobOrdersQuery';
import { MiddlewareHandler } from '../../core/middleware/MiddlewareHandler';

async function getAllJobOrders(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request) => {
        const query = new GetAllAppliedJobOrdersQuery();

        // Execute query
        const jobOrders = await query.ExecuteAsync(request);

        return jobOrders;
    });
}

exports.post = getAllJobOrders;
