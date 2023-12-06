import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Request } from 'express';

import { DailyReportsRepository } from '../../../dal/drydock/daily-reports/DailyReportsRepository';
import { IDailyReportsResultDto } from '../../../dal/drydock/daily-reports/dtos/IDailyReportsResultDto';
import { ODataResult } from '../../../shared/interfaces';
import { Query } from '../core/cqrs/Query';
import { GetDailyReportsResultDto } from './dtos/GetDailyReportsResultDto';
export class GetDailyReportsQuery extends Query<Request, ODataResult<IDailyReportsResultDto>> {
    dailyReportsRepository = new DailyReportsRepository();

    constructor() {
        super();
        this.dailyReportsRepository = new DailyReportsRepository();
    }

    protected async AuthorizationHandlerAsync(): Promise<void> {
        return;
    }

    protected async ValidationHandlerAsync(request: Request): Promise<void> {
        if (!request) {
            throw new Error('Request is null');
        }
        const createProjectDto: GetDailyReportsResultDto = plainToClass(GetDailyReportsResultDto, request.body);
        const result = await validate(createProjectDto);
        if (result.length) {
            throw result;
        }
    }

    protected async MainHandlerAsync(request: Request): Promise<ODataResult<IDailyReportsResultDto>> {
        const data = await this.dailyReportsRepository.get(request);
        return data;
    }
}
