import * as express from 'express';
import { Body, Controller, Post, Request, Route } from 'tsoa';

import { GetProjectDetailReportQuery } from '../../../application-layer/drydock/projects/GetProjectDetailReportQuery';
import { Req } from '../../../common/drydock/ts-helpers/req-res';
import { ODataBodyDto } from '../../../shared/dto';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function getProjectDetailReport(req: express.Request, res: express.Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: express.Request) => {
        const result = await new GetProjectDetailReportController().getProjectDetailReport(request.body, request);

        return result;
    });
}

exports.post = getProjectDetailReport;

@Route('drydock/projects/project-detail-report')
export class GetProjectDetailReportController extends Controller {
    @Post()
    public async getProjectDetailReport(
        @Body() odataBody: ODataBodyDto,
        @Request() request: Req<ODataBodyDto>,
    ): Promise<unknown> {
        const query = new GetProjectDetailReportQuery();

        const result = await query.ExecuteAsync(request, ODataBodyDto);

        return result;
    }
}
