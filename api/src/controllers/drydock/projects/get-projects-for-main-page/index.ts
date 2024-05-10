import * as express from 'express';
import { Body, Controller, Post, Request, Route } from 'tsoa';

import { IProjectsFromMainPageRecordDto } from '../../../../application-layer/drydock/projects/projects-for-main-page/dtos/IProjectsFromMainPageRecordDto';
import { ProjectsFromMainPageQuery } from '../../../../application-layer/drydock/projects/projects-for-main-page/ProjectsFromMainPageQuery';
import { Req } from '../../../../common/drydock/ts-helpers/req-res';
import { ODataBodyDto } from '../../../../shared/dto';
import { ODataResult } from '../../../../shared/interfaces';
import { MiddlewareHandler } from '../../core/middleware/MiddlewareHandler';

@Route('drydock/projects/get-projects-for-main-page')
export class GetProjectsForMainPageActionController extends Controller {
    @Post()
    public async getProjectsForMainPageAction(
        @Request() request: Req<ODataBodyDto>,
        @Body() odataBody: ODataBodyDto,
    ): Promise<ODataResult<IProjectsFromMainPageRecordDto>> {
        const query = new ProjectsFromMainPageQuery();

        const result = await query.ExecuteAsync(request, ODataBodyDto);

        return result;
    }
}

exports.post = new MiddlewareHandler().ExecuteHandlerAsync(async (request: express.Request) => {
    return new GetProjectsForMainPageActionController().getProjectsForMainPageAction(request, request.body);
});
