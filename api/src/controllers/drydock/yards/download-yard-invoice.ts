import express from 'express';
import { Controller, Get, Query, Route } from 'tsoa';

import { DownloadQuery, InvoiceDto } from '../../../application-layer/drydock/yards/dtos/InvoiceDto';
import { GetYardsInvoiceQuery } from '../../../application-layer/drydock/yards/GetYardsInvoiceQuery';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

export async function getYardReport(req: express.Request, res: express.Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async () => {
        const ProjectUid = req.query.ProjectUid as string;
        const YardUid = req.query.YardUid as string;
        const result = await new GetYardReportController().getYardReport(ProjectUid, YardUid);
        const { buffer, filename } = result as InvoiceDto;

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheet.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=${filename}.xlsx`);

        return buffer;
    });
}

exports.get = getYardReport;

@Route('drydock/yards/download-yard-invoice')
export class GetYardReportController extends Controller {
    @Get()
    public async getYardReport(@Query() ProjectUid: string, @Query() YardUid: string): Promise<unknown> {
        const data: DownloadQuery = { ProjectUid, YardUid };

        const query = new GetYardsInvoiceQuery();
        return query.ExecuteAsync(data);
    }
}
