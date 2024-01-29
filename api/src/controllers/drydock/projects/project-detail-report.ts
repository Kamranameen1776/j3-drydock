import { Request, Response } from 'express';

import { GetProjectDetailReportQuery } from '../../../application-layer/drydock/projects/GetProjectDetailReportQuery';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function getProjectDetailReport(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const command = new GetProjectDetailReportQuery();

        return command.ExecuteAsync(request);
    });
}

exports.post = getProjectDetailReport;
