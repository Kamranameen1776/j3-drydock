import { DailyReportsRepository } from '../../../dal/drydock/daily-reports/DailyReportsRepository';
import { Query } from '../core/cqrs/Query';
import { GetOneDailyReportDto } from './dtos/GetOneDailyReportDto';

export class GetOneDailyReportQuery extends Query<string, GetOneDailyReportDto> {
    dailyReportsRepository = new DailyReportsRepository();

    protected async AuthorizationHandlerAsync(): Promise<void> {
        return;
    }

    protected async ValidationHandlerAsync(): Promise<void> {
        return;
    }

    protected async MainHandlerAsync(uid: string): Promise<GetOneDailyReportDto> {
        return this.dailyReportsRepository.findOneByDailyReportUid(uid);
    }
}
