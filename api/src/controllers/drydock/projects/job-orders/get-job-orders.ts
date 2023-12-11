import { Request, Response } from 'express';

import { GetJobOrdersQuery } from '../../../../application-layer/drydock/projects/job-orders/GetJobOrdersQuery';
import { MiddlewareHandler } from '../../../../controllers/drydock/core/middleware/MiddlewareHandler';

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
        const query = new GetJobOrdersQuery();

        // Execute query
        const projects = await query.ExecuteAsync(request);

        return projects;
    });
}

exports.post = getJobOrders;
