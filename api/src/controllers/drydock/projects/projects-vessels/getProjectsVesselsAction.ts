import { Request, Response } from 'express';

import { ProjectsVesselsQuery } from '../../../../application-layer/drydock/projects/projects-vessels/ProjectsVesselsQuery';
import { MiddlewareHandler } from '../../core/middleware/MiddlewareHandler';

/**
 * This handler returns all available shipments
 * GET /drydock/example-projects
 * @exports
 * @param {Request} req Express request
 * @param {Response} res Express response
 */
export async function getProjectsVesselsAction(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async () => {
        const query = new ProjectsVesselsQuery();

        // Execute query
        const projects = await query.ExecuteAsync();

        return projects;
    });
}
