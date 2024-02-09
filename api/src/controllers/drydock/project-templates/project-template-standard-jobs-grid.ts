import * as express from 'express';
import { Body, Controller, Post, Request, Route, Tags } from 'tsoa';

import { GetProjectTemplateStandardJobsGridQuery } from '../../../application-layer/drydock/project-template/GetProjectTemplateStandardJobsGridQuery/GetProjectTemplateStandardJobsGridQuery';
import { Req } from '../../../common/drydock/ts-helpers/req-res';
import { IGetProjectTemplateStandardJobsGridDto } from '../../../dal/drydock/ProjectTemplate/IGetProjectTemplateStandardJobsGridDto';
import { ODataBodyDto } from '../../../shared/dto';
import { ODataResult } from '../../../shared/interfaces';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

@Tags('Project Template')
@Route('drydock/project-templates/project-template-standard-jobs-grid')
export class ProjectTemplateStandardJobsGridController extends Controller {
    @Post()
    public async GetProjectTemplateStandardJobsGridData(
        @Request() request: Req<ODataBodyDto>,
        @Body() odataBody: ODataBodyDto,
    ): Promise<ODataResult<IGetProjectTemplateStandardJobsGridDto>> {
        const query = new GetProjectTemplateStandardJobsGridQuery();

        const result = await query.ExecuteAsync(request, ODataBodyDto);

        return result;
    }
}

exports.post = new MiddlewareHandler().ExecuteHandlerAsync(async (request: express.Request) => {
    return new ProjectTemplateStandardJobsGridController().GetProjectTemplateStandardJobsGridData(
        request,
        request.body,
    );
});
