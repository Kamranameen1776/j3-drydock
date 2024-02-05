import { Request, Response } from 'express';
import { Controller, Get, Route } from 'tsoa';

import { ProjectsManagersQuery } from '../../../../application-layer/drydock/projects/projects-managers/ProjectsManagersQuery';
import { IProjectsManagersResultDto } from '../../../../dal/drydock/projects/dtos/IProjectsManagersResultDto';
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
        const result = await new GetProjectsManagersActionController().getProjectsManagersAction();

        return result;
    });
}

// @Route('drydock/projects/projects-managers')
export class GetProjectsManagersActionController extends Controller {
    @Get()
    public async getProjectsManagersAction(): Promise<IProjectsManagersResultDto[]> {
        const query = new ProjectsManagersQuery();

        const result = await query.ExecuteAsync();

        return result;
    }
}
