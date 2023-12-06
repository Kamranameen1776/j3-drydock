import { Request, Response } from 'express';

import { GetDailyReportsQuery } from '../../../application-layer/drydock/daily-reports/GetDailyReportsQuery';
import { RequestWithOData } from '../../../shared/interfaces';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

/**
 * @exports
 * @param {Request} req Express request
 * @param {Response} res Express response
 */
export async function getDailyReportsQuery(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const query = new GetDailyReportsQuery();

        const result = await query.ExecuteAsync(request as RequestWithOData);

        return result;
    });
}

exports.get = getDailyReportsQuery;
