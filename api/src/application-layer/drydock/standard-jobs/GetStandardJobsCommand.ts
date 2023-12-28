import { StandardJobsService } from '../../../bll/drydock/standard_jobs/standard-jobs.service';
import { StandardJobsRepository } from '../../../dal/drydock/standard-jobs/StandardJobsRepository';
import { RequestWithOData } from '../../../shared/interfaces';
import { Command } from '../core/cqrs/Command';
import { StandardJobsGridFiltersKeys, standardJobsGridFiltersKeys } from './Constants';
import { GetStandardJobsResultDto } from './dto';

export class GetStandardJobsCommand extends Command<RequestWithOData, GetStandardJobsResultDto> {
    standardJobsRepository = new StandardJobsRepository();
    standardJobsService = new StandardJobsService();

    constructor() {
        super();
    }

    protected async MainHandlerAsync(request: RequestWithOData): Promise<GetStandardJobsResultDto> {
        const filters = request.body.gridFilters.reduce(
            (acc, { odataKey, selectedValues }) =>
                standardJobsGridFiltersKeys.includes(odataKey as StandardJobsGridFiltersKeys) &&
                Array.isArray(selectedValues) &&
                selectedValues?.length
                    ? {
                          ...acc,
                          [odataKey]: selectedValues,
                      }
                    : acc,
            {} as Record<StandardJobsGridFiltersKeys, string[]>,
        );

        const data = await this.standardJobsRepository.getStandardJobs(request, filters);

        const uids = data.records.map((item) => item.uid);

        if (!uids.length) {
            return {
                records: [],
                count: 0,
            };
        }

        const subItems = await this.standardJobsRepository.getStandardJobSubItems(uids);

        return this.standardJobsService.mapStandardJobsDataToDto(data, subItems);
    }
}
