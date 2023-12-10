import { Request } from 'express';

import { DailyReportsRepository } from '../../../dal/drydock/daily-reports/DailyReportsRepository';
import { IDailyReportsResultDto } from '../../../dal/drydock/daily-reports/dtos/IDailyReportsResultDto';
import { ODataResult } from '../../../shared/interfaces';
import { Query } from '../core/cqrs/Query';
export class GetDailyReportsQuery extends Query<Request, ODataResult<IDailyReportsResultDto>> {
    dailyReportsRepository = new DailyReportsRepository();

    constructor() {
        super();
        this.dailyReportsRepository = new DailyReportsRepository();
    }

    protected async AuthorizationHandlerAsync(): Promise<void> {
        return;
    }

    protected async ValidationHandlerAsync(): Promise<void> {
        return;
    }

    protected async MainHandlerAsync(request: Request): Promise<ODataResult<IDailyReportsResultDto>> {
        const data = await this.dailyReportsRepository.getDailyReports(request);
        return data;
    }
}
