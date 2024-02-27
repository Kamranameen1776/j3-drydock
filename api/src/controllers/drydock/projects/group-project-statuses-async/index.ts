import * as express from 'express';
import { Controller, Get, Request, Route } from 'tsoa';

import { IGroupResponseAsyncDto } from '../../../../application-layer/drydock/projects/project-statuses/group-project-statuses/dtos/IGroupProjectStatusDto';
import { GroupProjectStatusesQuery } from '../../../../application-layer/drydock/projects/project-statuses/group-project-statuses/GroupProjectStatusesQuery';
import { MiddlewareHandler } from '../../core/middleware/MiddlewareHandler';

@Route('drydock/projects/group-project-statuses-async')
export class GetGroupProjectStatusesAsyncActionController extends Controller {
    @Get()
    public async getGroupProjectStatusesAsyncAction(
        @Request() request: express.Request,
    ): Promise<IGroupResponseAsyncDto> {
        const token: string = request.headers.authorization as string;

        const query = new GroupProjectStatusesQuery();

        const result = await query.ExecuteAsync(token);

        return result;
    }
}

exports.get = new MiddlewareHandler().ExecuteHandlerAsync(
    new GetGroupProjectStatusesAsyncActionController().getGroupProjectStatusesAsyncAction,
);
