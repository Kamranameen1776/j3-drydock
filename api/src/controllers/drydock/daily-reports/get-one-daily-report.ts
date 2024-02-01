import { Request, Response } from 'express';
import { Controller, Get, Query, Route } from 'tsoa';

import { GetOneDailyReportDto } from '../../../application-layer/drydock/daily-reports/dtos/GetOneDailyReportDto';
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
        const uid = request.query.uid as string;

        const result = await new GetOneDailyReportController().getOneDailyReport(uid);

        return result;
    });
}

exports.get = getOneDailyReport;

@Route('drydock/daily-reports/get-one-daily-report')
export class GetOneDailyReportController extends Controller {
    @Get()
    public async getOneDailyReport(@Query() uid: string): Promise<GetOneDailyReportDto> {
        const query = new GetOneDailyReportQuery();

        const result = await query.ExecuteAsync(uid);

        return result;
    }
}
