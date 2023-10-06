import { Request, Response } from 'express';

import { ProjectsSpecificationsStatusesQuery } from '../../../../application-layer/drydock/projects/projects-specifications-statuses/ProjectsSpecificationsStatusesQuery';
import { MiddlewareHandler } from '../../core/middleware/MiddlewareHandler';

/**
 * This handler returns all available shipments
 * GET /drydock/example-projects
 * @exports
 * @param {Request} req Express request
 * @param {Response} res Express response
 */
export async function getProjectsSpecificationsStatusesAction(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async () => {
        const query = new ProjectsSpecificationsStatusesQuery();

        // Execute query
        const projects = await query.ExecuteAsync();

        return projects;
    });
}
