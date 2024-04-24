import { DailyReportsRepository } from '../../../dal/drydock/daily-reports/DailyReportsRepository';
import { Query } from '../core/cqrs/Query';
import { GetDailyReportByIdModel } from './dtos/GetDailyReportByIdModel';
import { GetOneDailyReportDto } from './dtos/GetOneDailyReportDto';

export class GetOneDailyReportQuery extends Query<GetDailyReportByIdModel, GetOneDailyReportDto> {
    dailyReportsRepository = new DailyReportsRepository();

    protected async AuthorizationHandlerAsync(): Promise<void> {
        return;
    }

    protected async ValidationHandlerAsync(): Promise<void> {
        return;
    }

    protected async MainHandlerAsync(request: GetDailyReportByIdModel): Promise<GetOneDailyReportDto> {
        return this.dailyReportsRepository.findOneByDailyReportUid(request.DailyReportUid);
    }
}
