import { DailyReportsRepository } from '../../../dal/drydock/daily-reports/DailyReportsRepository';
import { Query } from '../core/cqrs/Query';
import { GetDailyReportsResultDto } from './dtos/GetDailyReportsResultDto';

export class GetDailyReportsQuery extends Query<string, GetDailyReportsResultDto[]> {
    dailyReportsRepository = new DailyReportsRepository();

    protected async AuthorizationHandlerAsync(): Promise<void> {
        return;
    }

    protected async ValidationHandlerAsync(): Promise<void> {
        return;
    }

    protected async MainHandlerAsync(uid: string): Promise<GetDailyReportsResultDto[]> {
        return this.dailyReportsRepository.getAllByProject(uid);
    }
}
