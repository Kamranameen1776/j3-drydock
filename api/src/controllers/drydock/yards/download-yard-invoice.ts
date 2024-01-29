import { Request, Response } from 'express';
import { Body, Controller, Get } from 'tsoa';

import { InvoiceDto } from '../../../application-layer/drydock/yards/dtos/InvoiceDto';
import { GetYardsInvoiceQuery } from '../../../application-layer/drydock/yards/GetYardsInvoiceQuery';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

export async function getYardReport(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async () => {
        const { buffer, filename } = await new GetYardReportController().getYardReport(req);

        // TODO: set headers for swagger as well and return Buffer

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheet.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=${filename}.xlsx`);

        return buffer;
    });
}

exports.get = getYardReport;

// @Route('drydock/yards/download-yard-invoice')
export class GetYardReportController extends Controller {
    @Get()
    public async getYardReport(@Body() request: Request): Promise<InvoiceDto> {
        const query = new GetYardsInvoiceQuery();
        const result = await query.ExecuteAsync(request);

        return result;
    }
}
