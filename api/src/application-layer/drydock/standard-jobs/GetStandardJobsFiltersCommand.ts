import { StandardJobsRepository } from '../../../dal/drydock/standard-jobs/StandardJobsRepository';
import { Command } from '../core/cqrs/Command';
import { Request } from 'express';
import { BusinessException } from '../../../bll/drydock/core/exceptions/BusinessException';
import { AllowedStandardJobsFiltersKeys, StandardJobsFiltersAllowedKeys } from './dto/GetStandardJobsFiltersRequestDto';
import { FiltersDataResponse } from '../../../shared/interfaces/filters-data-response.interface';

export class GetStandardJobsFiltersCommand extends Command<Request, FiltersDataResponse[]> {
    standardJobsRepository = new StandardJobsRepository();

    constructor() {
        super();
    }

    protected async ValidationHandlerAsync(request: Request): Promise<void> {
        const key = request.body.key;
        if (!key) {
            throw new BusinessException('Key is required');
        }

        if (!Object.values(AllowedStandardJobsFiltersKeys).includes(key)) {
            throw new BusinessException('Invalid key');
        }
    }

    protected async MainHandlerAsync(request: Request): Promise<FiltersDataResponse[]> {
        const key: StandardJobsFiltersAllowedKeys = request.body.key;
        const token: string = request.headers.authorization as string;
        return this.standardJobsRepository.getStandardJobFilters(key, token);
    }
}
