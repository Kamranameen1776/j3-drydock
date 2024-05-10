import { StandardJobsService } from '../../../bll/drydock/standard_jobs/standard-jobs.service';
import { StandardJobsRepository } from '../../../dal/drydock/standard-jobs/StandardJobsRepository';
import { Command } from '../core/cqrs/Command';
import { GetStandardJobsResultDto } from './dto';
import { GetStandardJobsRequest } from './dto/GetStandardJobsRequestDto';
import { StandardJobsGridFiltersKeys, standardJobsGridFiltersKeys } from './StandardJobsConstants';

export class GetStandardJobsCommand extends Command<GetStandardJobsRequest, GetStandardJobsResultDto> {
    standardJobsRepository = new StandardJobsRepository();
    standardJobsService = new StandardJobsService();

    constructor() {
        super();
    }

    protected async MainHandlerAsync(request: GetStandardJobsRequest): Promise<GetStandardJobsResultDto> {
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

        const data = await this.standardJobsRepository.getStandardJobs(
            request,
            filters,
            request.body.additionalFilters,
        );

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
