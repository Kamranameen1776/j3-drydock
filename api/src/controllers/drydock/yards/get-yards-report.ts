import { Request, Response } from 'express';

import { GetYardsReportQuery } from '../../../application-layer/drydock/yards/GetYardsReportQuery';

export async function getYardReport(req: Request, res: Response) {
    const query = new GetYardsReportQuery();
    try {
        const { workbook, filename } = await query.ExecuteAsync(req.query);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheet.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=${filename}.xlsx`);
        await workbook.xlsx.write(res);
    } finally {
        res.end();
    }
}

exports.get = getYardReport;
