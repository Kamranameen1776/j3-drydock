import { Request, Response } from 'express';

import { GetOneDailyReportQuery } from '../../../application-layer/drydock/daily-reports/GetOneDailyReportQuery';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

/**
 * @exports
 * @param {Request} req Express request
 * @param {Response} res Express response
 */
export async function getOneDailyReport(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const query = new GetOneDailyReportQuery();

        const uid = request.query.uid as string;
        const oneDailyReport = await query.ExecuteAsync(uid);

        return oneDailyReport;
    });
}

exports.get = getOneDailyReport;
