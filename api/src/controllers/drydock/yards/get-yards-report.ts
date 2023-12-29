import { Request, Response } from 'express';

import { GetYardsReportQuery } from '../../../application-layer/drydock/yards/GetYardsReportQuery';

/**
 * @exports
 * @param {Request} req Express request
 * @param {Response} res Express response
 */
export async function getYardReport(req: Request, res: Response) {
    const query = new GetYardsReportQuery();
    try {
        const { workbook, filename } = await query.ExecuteAsync(req.query);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=${filename}.xlsx`);
        await workbook.xlsx.write(res);
        // res.json(workbook);
        res.end();
    } catch (e) {
        res.end();
    }
}

exports.get = getYardReport;
