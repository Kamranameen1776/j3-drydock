import * as express from 'express';
import { Controller, Get, Query, Request, Route } from 'tsoa';

import { GetProjectByUidDto } from '../../../application-layer/drydock/projects/dtos/GetProjectByUidDto';
import { GetProjectQuery } from '../../../application-layer/drydock/projects/GetProjectQuery';
import { IProjectsFromMainPageRecordDto } from '../../../application-layer/drydock/projects/projects-for-main-page/dtos/IProjectsFromMainPageRecordDto';
import { MiddlewareHandler } from '../../../controllers/drydock/core/middleware/MiddlewareHandler';

@Route('drydock/projects/get-project')
export class GetProjectController extends Controller {
    @Get()
    public async getProject(
        @Request() request: express.Request,
        @Query() uid: string,
    ): Promise<IProjectsFromMainPageRecordDto> {
        const query = new GetProjectQuery();

        const dto = new GetProjectByUidDto();
        dto.uid = uid;
        dto.token = request.headers.authorization as string;

        const result = await query.ExecuteAsync(dto);

        return result;
    }
}

exports.get = new MiddlewareHandler().ExecuteHandlerAsync(async (request: express.Request) => {
    return new GetProjectController().getProject(request, request.query.uid as string);
});
