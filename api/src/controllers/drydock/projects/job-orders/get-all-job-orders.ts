import { Request, Response } from 'express';

import { GetAllJobOrdersQuery } from '../../../../application-layer/drydock/projects/job-orders/GetAllJobOrdersQuery';
import { MiddlewareHandler } from '../../../../controllers/drydock/core/middleware/MiddlewareHandler';

async function getAllJobOrders(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request) => {
        const query = new GetAllJobOrdersQuery();

        // Execute query
        const jobOrders = await query.ExecuteAsync(request);

        return jobOrders;
    });
}

exports.post = getAllJobOrders;
