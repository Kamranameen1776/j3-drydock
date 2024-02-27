import * as express from 'express';
import { Controller, Get, Request, Route } from 'tsoa';

import { IGroupResponseAsyncDto } from '../../../../application-layer/drydock/projects/project-statuses/group-project-statuses/dtos/IGroupProjectStatusDto';
import { GroupProjectStatusesAsyncQuery } from '../../../../application-layer/drydock/projects/project-statuses/group-project-statuses/GroupProjectStatusesAsyncQuery';
import { MiddlewareHandler } from '../../core/middleware/MiddlewareHandler';

@Route('drydock/projects/group-project-statuses-async')
export class GetGroupProjectStatusesAsyncActionController extends Controller {
    @Get()
    public async getGroupProjectStatusesAsyncAction(
        @Request() request: express.Request,
    ): Promise<IGroupResponseAsyncDto> {
        const token: string = request.headers.authorization as string;

        const query = new GroupProjectStatusesAsyncQuery();

        const result = await query.ExecuteAsync(token);

        return result;
    }
}

exports.get = new MiddlewareHandler().ExecuteHandlerAsync(
    new GetGroupProjectStatusesAsyncActionController().getGroupProjectStatusesAsyncAction,
);
