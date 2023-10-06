import { Request, Response } from 'express';

import { ProjectsManagersQuery } from '../../../../application-layer/drydock/projects/projects-managers/ProjectsManagersQuery';
import { MiddlewareHandler } from '../../core/middleware/MiddlewareHandler';

/**
 * This handler returns all available shipments
 * GET /drydock/example-projects
 * @exports
 * @param {Request} req Express request
 * @param {Response} res Express response
 */
export async function getProjectsManagersAction(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async () => {
        const query = new ProjectsManagersQuery();

        // Execute query
        const projects = await query.ExecuteAsync();

        return projects;
    });
}
