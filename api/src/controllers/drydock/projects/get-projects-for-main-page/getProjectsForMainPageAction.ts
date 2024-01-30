import * as express from 'express';
import { Body, Controller, Post, Request, Route } from 'tsoa';

import { OdataRequest } from '../../../../application-layer/drydock/core/cqrs/odata/OdataRequest';
import { IProjectsFromMainPageRecordDto } from '../../../../application-layer/drydock/projects/projects-for-main-page/dtos/IProjectsFromMainPageRecordDto';
import { ProjectsFromMainPageQuery } from '../../../../application-layer/drydock/projects/projects-for-main-page/ProjectsFromMainPageQuery';
import { MiddlewareHandler } from '../../../../controllers/drydock/core/middleware/MiddlewareHandler';
import { ODataBodyDto } from '../../../../shared/dto';
import { ODataResult } from '../../../../shared/interfaces';

export async function getProjectsForMainPageAction(req: express.Request, res: express.Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request) => {
        const result = await new GetProjectsForMainPageActionController().getProjectsForMainPageAction(
            request,
            req.body.odata,
        );

        return result;
    });
}

@Route('drydock/projects/get-projects-for-main-page')
export class GetProjectsForMainPageActionController extends Controller {
    @Post()
    public async getProjectsForMainPageAction(
        @Request() request: express.Request,
        @Body() odata: ODataBodyDto,
    ): Promise<ODataResult<IProjectsFromMainPageRecordDto>> {
        const query = new ProjectsFromMainPageQuery();

        const result = await query.ExecuteAsync(new OdataRequest(odata, request));

        return result;
    }
}
