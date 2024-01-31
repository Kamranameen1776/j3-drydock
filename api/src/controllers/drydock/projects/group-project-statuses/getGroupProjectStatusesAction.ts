import * as express from 'express';
import { Controller, Get, Request, Route } from 'tsoa';

import { IGroupResponseDto } from '../../../../application-layer/drydock/projects/project-statuses/group-project-statuses/dtos/IGroupProjectStatusDto';
import { GroupProjectStatusesQuery } from '../../../../application-layer/drydock/projects/project-statuses/group-project-statuses/GroupProjectStatusesQuery';
import { MiddlewareHandler } from '../../core/middleware/MiddlewareHandler';

export async function getGroupProjectStatusesAction(req: express.Request, res: express.Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async () => {
        const result = await new GetGroupProjectStatusesActionController().getGroupProjectStatusesAction(req);

        return result;
    });
}

@Route('drydock/projects/group-project-statuses')
export class GetGroupProjectStatusesActionController extends Controller {
    @Get()
    public async getGroupProjectStatusesAction(@Request() request: express.Request): Promise<IGroupResponseDto> {
        const token: string = request.headers.authorization as string;

        const query = new GroupProjectStatusesQuery();

        const result = await query.ExecuteAsync(token);

        return result;
    }
}
