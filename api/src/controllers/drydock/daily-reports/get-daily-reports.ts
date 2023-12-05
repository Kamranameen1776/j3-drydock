import { Request, Response } from 'express';

import { GetDailyReportsQuery } from '../../../application-layer/drydock/daily-reports/GetDailyReportsQuery';
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

        const uid = request.query.uid as string;
        const result = await query.ExecuteAsync(uid);

        return result;
    });
}

exports.get = getDailyReportsQuery;
