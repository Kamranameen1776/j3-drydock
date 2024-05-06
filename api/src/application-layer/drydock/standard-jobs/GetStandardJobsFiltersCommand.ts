import { BusinessException } from '../../../bll/drydock/core/exceptions/BusinessException';
import { StandardJobsRepository } from '../../../dal/drydock/standard-jobs/StandardJobsRepository';
import { FiltersDataResponse } from '../../../shared/interfaces/filters-data-response.interface';
import { Command } from '../core/cqrs/Command';
import { AllowedStandardJobsFiltersKeys, StandardJobsFiltersAllowedKeysRequestDto } from './dto';

export class GetStandardJobsFiltersCommand extends Command<
    StandardJobsFiltersAllowedKeysRequestDto,
    FiltersDataResponse[]
> {
    standardJobsRepository = new StandardJobsRepository();

    constructor() {
        super();
    }

    protected async ValidationHandlerAsync(request: StandardJobsFiltersAllowedKeysRequestDto): Promise<void> {
        const key = request.key;
        if (!key) {
            throw new BusinessException('Key is required');
        }

        if (!Object.values(AllowedStandardJobsFiltersKeys).includes(key)) {
            throw new BusinessException('Invalid key');
        }
    }

    protected async MainHandlerAsync(
        request: StandardJobsFiltersAllowedKeysRequestDto,
    ): Promise<FiltersDataResponse[]> {
        return this.standardJobsRepository.getStandardJobFilters(request.key, request.token);
    }
}
