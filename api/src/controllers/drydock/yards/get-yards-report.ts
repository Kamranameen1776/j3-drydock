import { Request, Response } from 'express';

import { GetYardsReportQuery } from '../../../application-layer/drydock/yards/GetYardsReportQuery';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

/**
 * @exports
 * @param {Request} req Express request
 * @param {Response} res Express response
 */
export async function getYardReport(req: Request, res: Response) {
    const query = new GetYardsReportQuery();

    const uid = req.query.uid as string;
    const workbook = await query.ExecuteAsync(uid);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=example.xlsx');
    await workbook.xlsx.write(res);
    res.end();
}

exports.get = getYardReport;
