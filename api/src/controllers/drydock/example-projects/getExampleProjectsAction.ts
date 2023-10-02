import { Request, Response } from 'express';

import { GetExampleProjectsQuery } from '../../../application-layer/drydock/example-projects/get-example-projects/GetExampleProjectsQuery';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

/**
 * This handler returns all available shipments
 * GET /drydock/example-projects
 * @exports
 * @param {Request} req Express request
 * @param {Response} res Express response
 */
export async function getExampleProjectsAction(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async () => {
        // Prepare query payload
        let queryDto: void;

        const query = new GetExampleProjectsQuery();

        // Execute query
        const projects = await query.ExecuteAsync(queryDto);

        return projects;
    });
}
