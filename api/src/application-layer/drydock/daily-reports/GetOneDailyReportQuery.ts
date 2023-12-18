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

    protected async MainHandlerAsync(request: Request): Promise<GetOneDailyReportDto> {
        const reportDetails = await this.dailyReportsRepository.findOneByDailyReportUid(request.query.uid as string);
        reportDetails.JobOrdersUpdate = await this.dailyReportsRepository.findDailyReportUpdate(
            request.query.uid as string,
        );
        return reportDetails;
    }
}
