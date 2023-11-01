import { Request, Response } from 'express';

import { GetProjectQuery } from '../../../application-layer/drydock/projects/GetProjectQuery';
import { MiddlewareHandler } from '../../../controllers/drydock/core/middleware/MiddlewareHandler';

/**
 * This handler returns all available shipments
 * GET /drydock/example-projects
 * @exports
 * @param {Request} req Express request
 * @param {Response} res Express response
 */
async function getProject(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request) => {
        const query = new GetProjectQuery();

        // Execute query
        const projects = await query.ExecuteAsync(request);

        return projects;
    });
}
exports.get = getProject;
