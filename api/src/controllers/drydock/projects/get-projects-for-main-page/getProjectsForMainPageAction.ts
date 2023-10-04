import { Request, Response } from 'express';

import { GetProjectsFromMainPageQuery } from '../../../../application-layer/drydock/projects/get-projects-for-main-page/GetProjectsFromMainPageQuery';
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

    await middlewareHandler.ExecuteAsync(req, res, async () => {
        // Prepare query payload
        let queryDto: void;

        const query = new GetProjectsFromMainPageQuery();

        // Execute query
        const projects = await query.ExecuteAsync(queryDto);

        return projects;
    });
}
