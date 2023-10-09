import { Request, Response } from 'express';

import { ProjectStatusesQuery } from '../../../../application-layer/drydock/projects/project-statuses/ProjectStatusesQuery';
import { MiddlewareHandler } from '../../core/middleware/MiddlewareHandler';

/**
 * This handler returns all available shipments
 * GET /drydock/example-projects
 * @exports
 * @param {Request} req Express request
 * @param {Response} res Express response
 */
export async function getProjectStatusesAction(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async () => {
        const query = new ProjectStatusesQuery();

        // Execute query
        const projects = await query.ExecuteAsync();

        return projects;
    });
}
