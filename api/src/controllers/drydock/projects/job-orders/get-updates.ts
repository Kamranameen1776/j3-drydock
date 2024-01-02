import { Request, Response } from 'express';

import { GetUpdatesQuery } from '../../../../application-layer/drydock/projects/job-orders/GetUpdatesQuery';
import { MiddlewareHandler } from '../../core/middleware/MiddlewareHandler';

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
        const query = new GetUpdatesQuery();

        // Execute query
        const projects = await query.ExecuteAsync(request);

        return projects;
    });
}

exports.post = getJobOrders;
