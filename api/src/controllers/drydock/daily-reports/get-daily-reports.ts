import { Request, Response } from 'express';
import { Body, Controller, Post } from 'tsoa';

import { GetDailyReportsQuery } from '../../../application-layer/drydock/daily-reports/GetDailyReportsQuery';
import { IDailyReportsResultDto } from '../../../dal/drydock/daily-reports/dtos/IDailyReportsResultDto';
import { ODataResult, RequestWithOData } from '../../../shared/interfaces';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

/**
 * @exports
 * @param {Request} req Express request
 * @param {Response} res Express response
 */
export async function getDailyReportsQuery(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const result = await new GetDailyReportsQueryController().getDailyReportsQuery(request as RequestWithOData);

        return result;
    });
}

exports.post = getDailyReportsQuery;

// @Route('drydock/daily-reports/get-daily-reports')
export class GetDailyReportsQueryController extends Controller {
    @Post()
    public async getDailyReportsQuery(@Body() dto: RequestWithOData): Promise<ODataResult<IDailyReportsResultDto>> {
        const query = new GetDailyReportsQuery();

        const result = await query.ExecuteAsync(dto);

        return result;
    }
}
