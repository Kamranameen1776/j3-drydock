import { Request, Response } from 'express';
import { Body, Controller, Post } from 'tsoa';

import { IProjectsFromMainPageRecordDto } from '../../../../application-layer/drydock/projects/projects-for-main-page/dtos/IProjectsFromMainPageRecordDto';
import { ProjectsFromMainPageQuery } from '../../../../application-layer/drydock/projects/projects-for-main-page/ProjectsFromMainPageQuery';
import { MiddlewareHandler } from '../../../../controllers/drydock/core/middleware/MiddlewareHandler';
import { ODataResult } from '../../../../shared/interfaces';

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
        const result = await new GetProjectsForMainPageActionController().getProjectsForMainPageAction(request);

        return result;
    });
}

// @Route('drydock/projects/get-projects-for-main-page')
export class GetProjectsForMainPageActionController extends Controller {
    @Post()
    public async getProjectsForMainPageAction(
        @Body() request: Request,
    ): Promise<ODataResult<IProjectsFromMainPageRecordDto>> {
        const query = new ProjectsFromMainPageQuery();

        const result = await query.ExecuteAsync(request);

        return result;
    }
}
