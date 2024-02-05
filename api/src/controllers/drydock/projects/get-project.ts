import * as express from 'express';
import { Controller, Get, Query, Request, Route } from 'tsoa';

import { GetProjectByUidDto } from '../../../application-layer/drydock/projects/dtos/GetProjectByUidDto';
import { GetProjectQuery } from '../../../application-layer/drydock/projects/GetProjectQuery';
import { IProjectsFromMainPageRecordDto } from '../../../application-layer/drydock/projects/projects-for-main-page/dtos/IProjectsFromMainPageRecordDto';
import { MiddlewareHandler } from '../../../controllers/drydock/core/middleware/MiddlewareHandler';

async function getProject(req: express.Request, res: express.Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request) => {
        const result = await new GetProjectController().getProject(request.query.uid as string, request);

        return result;
    });
}
exports.get = getProject;

// @Route('drydock/projects/get-project')
export class GetProjectController extends Controller {
    @Get()
    public async getProject(
        @Query() uid: string,
        @Request() request: express.Request,
    ): Promise<IProjectsFromMainPageRecordDto> {
        const query = new GetProjectQuery();

        const dto = new GetProjectByUidDto();
        dto.uid = uid;
        dto.token = request.headers.authorization as string;

        const result = await query.ExecuteAsync(dto);

        return result;
    }
}
