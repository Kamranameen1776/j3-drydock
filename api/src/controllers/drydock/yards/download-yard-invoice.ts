import { Request, Response } from 'express';
import { Body, Controller, Post, Route } from 'tsoa';

import { DownloadQuery, InvoiceDto } from '../../../application-layer/drydock/yards/dtos/InvoiceDto';
import { GetYardsInvoiceQuery } from '../../../application-layer/drydock/yards/GetYardsInvoiceQuery';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

export async function getYardReport(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async () => {
        const { buffer, filename } = (await new GetYardReportController().getYardReport(req.body)) as InvoiceDto;

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheet.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=${filename}.xlsx`);

        return buffer;
    });
}

exports.get = getYardReport;
exports.post = getYardReport;

@Route('drydock/yards/download-yard-invoice')
export class GetYardReportController extends Controller {
    // tsoa is not supporting Get with body
    @Post()

    // TODO: check if newer version of tsoa supports returning a specific type
    //public async getYardReport(@Body() dto: DownloadQuery): Promise<InvoiceDto> {
    public async getYardReport(@Body() dto: DownloadQuery): Promise<unknown> {
        const query = new GetYardsInvoiceQuery();
        const result = await query.ExecuteAsync(dto);

        return result;
    }
}
