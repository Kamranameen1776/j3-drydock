import { Request, Response } from 'express';
import { Controller, Get, Route } from 'tsoa';

import { ProjectTypesQuery } from '../../../../application-layer/drydock/projects/project-types/ProjectTypesQuery';
import { IProjectTypeResultDto } from '../../../../dal/drydock/projects/dtos/IProjectTypeResultDto';
import { MiddlewareHandler } from '../../core/middleware/MiddlewareHandler';

/**
 * This handler returns all available shipments
 * GET /drydock/example-projects
 * @exports
 * @param {Request} req Express request
 * @param {Response} res Express response
 */
export async function getProjectTypesAction(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async () => {
        const result = await new GetProjectTypesActionController().getProjectTypesAction();

        return result;
    });
}

@Route('drydock/projects/project-types')
export class GetProjectTypesActionController extends Controller {
    @Get()
    public async getProjectTypesAction(): Promise<IProjectTypeResultDto[]> {
        const query = new ProjectTypesQuery();

        const result = await query.ExecuteAsync();

        return result;
    }
}
