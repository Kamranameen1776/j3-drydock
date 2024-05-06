import { Req } from '../../../common/drydock/ts-helpers/req-res';
import { SpecificationDetailsRepository } from '../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { SpecificationDetailsEntity } from '../../../entity/drydock';
import { GridRequestBody } from '../core/cqrs/jbGrid/GridRequestBody';
import { Query } from '../core/cqrs/Query';
import {
    SpecificationDetailsGridFiltersKeys,
    specificationDetailsGridFiltersKeys,
} from './SpecificationDetailsConstants';

export class GetManySpecificationDetailsQuery extends Query<
    Req<GridRequestBody>,
    { records: SpecificationDetailsEntity[]; count?: number }
> {
    specificationDetailsRepository: SpecificationDetailsRepository = new SpecificationDetailsRepository();

    protected async AuthorizationHandlerAsync(): Promise<void> {
        return;
    }

    /**
     *
     * @returns All specification details
     */
    protected async MainHandlerAsync(request: Req<GridRequestBody>) {
        const filters = request.body.gridFilters.reduce(
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
