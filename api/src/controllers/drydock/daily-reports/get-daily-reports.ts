import { Controller, Post, Request, Route } from 'tsoa';

import { GetDailyReportsQuery } from '../../../application-layer/drydock/daily-reports/GetDailyReportsQuery';
import { IDailyReportsResultDto } from '../../../dal/drydock/daily-reports/dtos/IDailyReportsResultDto';
import { ODataResult, RequestWithOData } from '../../../shared/interfaces';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

@Route('drydock/daily-reports/get-daily-reports')
export class GetDailyReportsQueryController extends Controller {
    @Post()
    public async getDailyReportsQuery(@Request() dto: RequestWithOData): Promise<ODataResult<IDailyReportsResultDto>> {
        const query = new GetDailyReportsQuery();

        const result = await query.ExecuteAsync(dto);

        return result;
    }
}

exports.post = new MiddlewareHandler().ExecuteHandlerAsync(new GetDailyReportsQueryController().getDailyReportsQuery);
