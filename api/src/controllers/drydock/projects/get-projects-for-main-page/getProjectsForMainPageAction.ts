import { Request, Response } from 'express';

import { ProjectsFromMainPageQuery } from '../../../../application-layer/drydock/projects/projects-for-main-page/ProjectsFromMainPageQuery';
import { MiddlewareHandler } from '../../../../controllers/drydock/core/middleware/MiddlewareHandler';

/**
 * This handler returns all available shipments
 * GET /drydock/example-projects
 * @exports
 * @param {Request} req Express request
 * @param {Response} res Express response
 */
export async function getProjectsForMainPageAction(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request) => {
        const query = new ProjectsFromMainPageQuery();

        // Execute query
        const projects = await query.ExecuteAsync(request);

        return projects;
    });
}
