import { Request, Response } from 'express';

import { GetJobOrderStatusesQuery } from '../../../../application-layer/drydock/projects/job-orders/GetJobOrderStatusesQuery';
import { MiddlewareHandler } from '../../core/middleware/MiddlewareHandler';

/**
 * This handler returns all available shipments
 * GET /drydock/example-projects
 * @exports
 * @param {Request} req Express request
 * @param {Response} res Express response
 */
async function getJobOrderStatuses(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request) => {
        const query = new GetJobOrderStatusesQuery();

        // Execute query
        const projects = await query.ExecuteAsync();

        return projects;
    });
}

exports.get = getJobOrderStatuses;
