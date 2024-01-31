import { SpecificationDetailsRepository } from '../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { SpecificationDetailsEntity } from '../../../entity/drydock';
import { GridRequest } from '../core/cqrs/jbGrid/GridRequest';
import { Query } from '../core/cqrs/Query';
import {
    SpecificationDetailsGridFiltersKeys,
    specificationDetailsGridFiltersKeys,
} from './SpecificationDetailsConstants';

export class GetManySpecificationDetailsQuery extends Query<
    GridRequest,
    { records: SpecificationDetailsEntity[]; count?: number }
> {
    specificationDetailsRepository: SpecificationDetailsRepository = new SpecificationDetailsRepository();

    protected async AuthorizationHandlerAsync(): Promise<void> {
        return;
    }

    protected async ValidationHandlerAsync(): Promise<void> {
        return;
    }

    /**
     *
     * @returns All specification details
     */
    protected async MainHandlerAsync(request: GridRequest) {
        const filters = request.gridFilters.reduce(
            (acc, { odataKey, selectedValues }) =>
                specificationDetailsGridFiltersKeys.includes(odataKey as SpecificationDetailsGridFiltersKeys) &&
                Array.isArray(selectedValues) &&
                selectedValues?.length
                    ? {
                          ...acc,
                          [odataKey]: selectedValues,
                      }
                    : acc,
            {} as Record<SpecificationDetailsGridFiltersKeys, string[]>,
        );

        return this.specificationDetailsRepository.GetManySpecificationDetails(request.request, filters);
    }
}
