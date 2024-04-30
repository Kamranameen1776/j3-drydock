import * as express from 'express';
import { Body, Controller, Post, Request, Route } from 'tsoa';

import { GroupProjectStatusesCountsRequestModel } from '../../../../application-layer/drydock/projects/project-statuses/group-project-statuses/dtos/GroupProjectStatusesCountsRequestModel';
import { IGroupResponseDto } from '../../../../application-layer/drydock/projects/project-statuses/group-project-statuses/dtos/IGroupProjectStatusDto';
import { GroupProjectStatusesQuery } from '../../../../application-layer/drydock/projects/project-statuses/group-project-statuses/GroupProjectStatusesQuery';
import { MiddlewareHandler } from '../../core/middleware/MiddlewareHandler';

@Route('drydock/projects/group-project-statuses')
export class GetGroupProjectStatusesActionController extends Controller {
    @Post()
    public async getGroupProjectStatusesAction(
        @Request() request: express.Request,
        @Body() body: GroupProjectStatusesCountsRequestModel,
    ): Promise<IGroupResponseDto> {
        const token: string = request.headers.authorization as string;

        body.Token = token;

        const query = new GroupProjectStatusesQuery();

        const result = await query.ExecuteRequestAsync(body, GroupProjectStatusesCountsRequestModel);

        return result;
    }
}

exports.post = new MiddlewareHandler().ExecuteHandlerAsync(async (request: express.Request) => {
    return new GetGroupProjectStatusesActionController().getGroupProjectStatusesAction(request, request.body);
});
