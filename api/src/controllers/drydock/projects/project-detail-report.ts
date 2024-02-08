import * as express from 'express';
import { Body, Controller, Post, Request, Route } from 'tsoa';

import { GetProjectDetailReportQuery } from '../../../application-layer/drydock/projects/GetProjectDetailReportQuery';
import { Req } from '../../../common/drydock/ts-helpers/req-res';
import { ODataBodyDto } from '../../../shared/dto';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

@Route('drydock/projects/project-detail-report')
export class GetProjectDetailReportController extends Controller {
    @Post()
    public async getProjectDetailReport(
        @Request() request: Req<ODataBodyDto>,
        @Body() odataBody: ODataBodyDto,
    ): Promise<unknown> {
        const query = new GetProjectDetailReportQuery();

        const result = await query.ExecuteAsync(request, ODataBodyDto);

        return result;
    }
}

exports.post = new MiddlewareHandler().ExecuteHandlerAsync(async (request: express.Request) => {
    return new GetProjectDetailReportController().getProjectDetailReport(request, request.body);
});
