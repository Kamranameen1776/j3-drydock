import { Request, Response } from 'express';
import { Body, Controller, Post } from 'tsoa';

import { GetProjectDetailReportQuery } from '../../../application-layer/drydock/projects/GetProjectDetailReportQuery';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function getProjectDetailReport(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const result = await new GetProjectDetailReportController().getProjectDetailReport(request);

        return result;
    });
}

exports.post = getProjectDetailReport;

// @Route('drydock/projects/project-detail-report')
export class GetProjectDetailReportController extends Controller {
    @Post()
    public async getProjectDetailReport(@Body() request: Request): Promise<unknown> {
        const query = new GetProjectDetailReportQuery();

        const result = await query.ExecuteAsync(request);

        return result;
    }
}
