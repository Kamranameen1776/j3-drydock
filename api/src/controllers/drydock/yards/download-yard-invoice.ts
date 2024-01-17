import { Request, Response } from 'express';

import { GetYardsInvoiceQuery } from '../../../application-layer/drydock/yards/GetYardsInvoiceQuery';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

export async function getYardReport(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async () => {
        const query = new GetYardsInvoiceQuery();
        const { buffer, filename } = await query.ExecuteAsync(req);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheet.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=${filename}.xlsx`);

        return buffer;
    });
}

exports.get = getYardReport;
