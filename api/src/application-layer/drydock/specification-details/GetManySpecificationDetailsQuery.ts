import { Request } from 'express';

import { SpecificationDetailsRepository } from '../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { SpecificationDetailsEntity } from '../../../entity/drydock';
import { GridFilter } from '../../../shared/interfaces/GridFilter';
import { Query } from '../core/cqrs/Query';
import {
    SpecificationDetailsGridFiltersKeys,
    specificationDetailsGridFiltersKeys,
} from './SpecificationDetailsConstants';

export class GetManySpecificationDetailsQuery extends Query<
    Request,
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
    protected async MainHandlerAsync(request: Request) {
        const gridFilter = request.body.gridFilters as GridFilter[];
        const filters = gridFilter.reduce(
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

        return this.specificationDetailsRepository.GetManySpecificationDetails(request, filters);
    }
}
