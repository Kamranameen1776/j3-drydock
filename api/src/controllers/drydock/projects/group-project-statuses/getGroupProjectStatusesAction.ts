import { Request, Response } from 'express';
import { Body, Controller, Get } from 'tsoa';

import { IGroupResponseDto } from '../../../../application-layer/drydock/projects/project-statuses/group-project-statuses/dtos/IGroupProjectStatusDto';
import { GroupProjectStatusesQuery } from '../../../../application-layer/drydock/projects/project-statuses/group-project-statuses/GroupProjectStatusesQuery';
import { MiddlewareHandler } from '../../core/middleware/MiddlewareHandler';

/**
 * This handler returns all available shipments
 * GET /drydock/example-projects
 * @exports
 * @param {Request} req Express request
 * @param {Response} res Express response
 */
export async function getGroupProjectStatusesAction(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async () => {
        const result = await new GetGroupProjectStatusesActionController().getGroupProjectStatusesAction(req);

        return result;
    });
}

// @Route('drydock/projects/group-project-statuses')
export class GetGroupProjectStatusesActionController extends Controller {
    @Get()
    public async getGroupProjectStatusesAction(@Body() request: Request): Promise<IGroupResponseDto> {
        const query = new GroupProjectStatusesQuery();

        const result = await query.ExecuteAsync(request);

        return result;
    }
}
