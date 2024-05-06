import * as express from 'express';
import { Body, Controller, Post, Request, Route, Tags } from 'tsoa';

import { GetProjectTemplateGridQuery } from '../../../application-layer/drydock/project-template/GetProjectTemplateGridQuery/GetProjectTemplateGridQuery';
import { Req } from '../../../common/drydock/ts-helpers/req-res';
import { IGetProjectTemplateGridDto } from '../../../dal/drydock/ProjectTemplate/IGetProjectTemplateGridDto';
import { ODataBodyDtoWithFilters } from '../../../shared/dto';
import { ODataResult } from '../../../shared/interfaces';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

@Tags('Project Template')
@Route('drydock/project-templates/project-templates-grid')
export class ProjectTemplatesGridController extends Controller {
    @Post()
    public async GetProjectTemplatesGridData(
        @Request() request: Req<ODataBodyDtoWithFilters>,
        @Body() odataBody: ODataBodyDtoWithFilters,
    ): Promise<ODataResult<IGetProjectTemplateGridDto>> {
        const query = new GetProjectTemplateGridQuery();

        const result = await query.ExecuteAsync(request, ODataBodyDtoWithFilters);

        return result;
    }
}

exports.post = new MiddlewareHandler().ExecuteHandlerAsync(async (request: express.Request) => {
    return new ProjectTemplatesGridController().GetProjectTemplatesGridData(request, request.body);
});
