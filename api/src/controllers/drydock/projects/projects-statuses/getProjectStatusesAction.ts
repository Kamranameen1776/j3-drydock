import { Request, Response } from 'express';
import { Controller, Get, Route } from 'tsoa';

import { ProjectStatusesQuery } from '../../../../application-layer/drydock/projects/project-statuses/ProjectStatusesQuery';
import { IProjectStatusResultDto } from '../../../../dal/drydock/projects/dtos/IProjectStatusResultDto';
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
        const result = await new GetProjectStatusesActionController().getProjectStatusesAction();

        return result;
    });
}

// @Route('drydock/projects/projects-statuses')
export class GetProjectStatusesActionController extends Controller {
    @Get()
    public async getProjectStatusesAction(): Promise<IProjectStatusResultDto[]> {
        const query = new ProjectStatusesQuery();

        const result = await query.ExecuteAsync();

        return result;
    }
}
