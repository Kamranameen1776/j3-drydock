import { Request } from 'express';
import { Controller, Get, Query, Route } from 'tsoa';

import { GetDailyReportByIdModel } from '../../../application-layer/drydock/daily-reports/dtos/GetDailyReportByIdModel';
import { GetOneDailyReportDto } from '../../../application-layer/drydock/daily-reports/dtos/GetOneDailyReportDto';
import { GetOneDailyReportQuery } from '../../../application-layer/drydock/daily-reports/GetOneDailyReportQuery';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

@Route('drydock/daily-reports/get-one-daily-report')
export class GetOneDailyReportController extends Controller {
    @Get()
    public async getOneDailyReport(@Query() uid: string): Promise<GetOneDailyReportDto> {
        const query = new GetOneDailyReportQuery();

        const model = new GetDailyReportByIdModel();
        model.DailyReportUid = uid;
        const result = await query.ExecuteRequestAsync(model, GetDailyReportByIdModel);

        return result;
    }
}

exports.get = new MiddlewareHandler().ExecuteHandlerAsync(async (request: Request) => {
    return new GetOneDailyReportController().getOneDailyReport(request.query.uid as string);
});
