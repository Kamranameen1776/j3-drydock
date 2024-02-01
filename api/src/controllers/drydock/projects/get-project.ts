import { Request, Response } from 'express';
import { Body, Controller, Get } from 'tsoa';

import { GetProjectQuery } from '../../../application-layer/drydock/projects/GetProjectQuery';
import { IProjectsFromMainPageRecordDto } from '../../../application-layer/drydock/projects/projects-for-main-page/dtos/IProjectsFromMainPageRecordDto';
import { MiddlewareHandler } from '../../../controllers/drydock/core/middleware/MiddlewareHandler';

/**
 * This handler returns all available shipments
 * GET /drydock/example-projects
 * @exports
 * @param {Request} req Express request
 * @param {Response} res Express response
 */
async function getProject(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request) => {
        const result = await new GetProjectController().getProject(request);

        return result;
    });
}
exports.get = getProject;

// @Route('drydock/projects/get-project')
export class GetProjectController extends Controller {
    @Get()
    public async getProject(@Body() request: Request): Promise<IProjectsFromMainPageRecordDto> {
        const query = new GetProjectQuery();

        const result = await query.ExecuteAsync(request);

        return result;
    }
}
