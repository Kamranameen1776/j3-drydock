import { Request } from 'express';

import { DailyReportsRepository } from '../../../dal/drydock/daily-reports/DailyReportsRepository';
import { Query } from '../core/cqrs/Query';
import { GetOneDailyReportDto } from './dtos/GetOneDailyReportDto';

export class GetOneDailyReportQuery extends Query<Request, GetOneDailyReportDto> {
    dailyReportsRepository = new DailyReportsRepository();

    protected async AuthorizationHandlerAsync(): Promise<void> {
        return;
    }

    protected async ValidationHandlerAsync(): Promise<void> {
        return;
    }

    protected async MainHandlerAsync(data: Request): Promise<GetOneDailyReportDto> {
        const dailyReportUid = data.query.uid as string;
        return this.dailyReportsRepository.findOneByDailyReportUid(dailyReportUid);
    }
}
