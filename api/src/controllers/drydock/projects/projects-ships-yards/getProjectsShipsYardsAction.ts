import { Request, Response } from 'express';
import { Controller, Get, Route } from 'tsoa';

import { IProjectsShipsYardsResultDto } from '../../../../application-layer/drydock/projects/projects-ships-yards/IProjectsShipsYardsResultDto';
import { ProjectsShipsYardsQuery } from '../../../../application-layer/drydock/projects/projects-ships-yards/ProjectsShipsYardsQuery';
import { MiddlewareHandler } from '../../core/middleware/MiddlewareHandler';

/**
 * This handler returns all available shipments
 * GET /drydock/example-projects
 * @exports
 * @param {Request} req Express request
 * @param {Response} res Express response
 */
export async function getProjectsShipsYardsAction(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async () => {
        const result = await new GetProjectsShipsYardsActionController().getProjectsShipsYardsAction();

        return result;
    });
}

@Route('drydock/projects/projects-ships-yards')
export class GetProjectsShipsYardsActionController extends Controller {
    @Get()
    public async getProjectsShipsYardsAction(): Promise<IProjectsShipsYardsResultDto[]> {
        const query = new ProjectsShipsYardsQuery();

        const result = await query.ExecuteAsync();

        return result;
    }
}
