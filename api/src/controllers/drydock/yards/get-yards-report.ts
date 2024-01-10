import { Request, Response } from 'express';

import { GetYardsReportQuery } from '../../../application-layer/drydock/yards/GetYardsReportQuery';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

export async function getYardReport(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async () => {
        const query = new GetYardsReportQuery();
        const { workbook, filename } = await query.ExecuteAsync(req.query);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheet.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=${filename}.xlsx`);

        return workbook.xlsx.writeBuffer();
    });
}

exports.get = getYardReport;
