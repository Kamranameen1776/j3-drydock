import { Request, Response } from 'express';
import { Controller, Get, Route } from 'tsoa';

import { ProjectsVesselsQuery } from '../../../../application-layer/drydock/projects/projects-vessels/ProjectsVesselsQuery';
import { IProjectVesselsResultDto } from '../../../../dal/drydock/projects/dtos/IProjectVesselsResultDto';
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
        const result = await new GetProjectsVesselsActionController().getProjectsVesselsAction();

        return result;
    });
}

// @Route('drydock/projects/projects-vessels/getProjectsVesselsAction')
export class GetProjectsVesselsActionController extends Controller {
    @Get()
    public async getProjectsVesselsAction(): Promise<IProjectVesselsResultDto[]> {
        const query = new ProjectsVesselsQuery();

        const result = await query.ExecuteAsync();

        return result;
    }
}
