import { Request, Response } from 'express';

import { GetYardsReportQuery } from '../../../application-layer/drydock/yards/GetYardsReportQuery';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

/**
 * @exports
 * @param {Request} req Express request
 * @param {Response} res Express response
 */
export async function getYardReport(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const query = new GetYardsReportQuery();

        const uid = request.query.uid as string;
        const yardToProjectList = await query.ExecuteAsync(uid);

        return yardToProjectList;
    });
}

exports.get = getYardReport;
