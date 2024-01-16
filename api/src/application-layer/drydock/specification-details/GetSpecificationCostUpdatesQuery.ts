import { SpecificationSubItemService } from '../../../bll/drydock/specification-details/specification-sub-item.service';
import { Req } from '../../../common/drydock/ts-helpers/req-res';
import {
    SpecificationCostUpdateDto,
    SpecificationCostUpdateRequestDto,
} from '../../../dal/drydock/specification-details/dtos/ISpecificationCostUpdateDto';
import { SpecificationDetailsRepository } from '../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { ODataResult, RequestWithOData } from '../../../shared/interfaces';
import { FoldableGridData } from '../../../shared/interfaces/foldable-grid-data.interface';
import { Query } from '../core/cqrs/Query';

export class GetSpecificationCostUpdatesQuery extends Query<
    Req<SpecificationCostUpdateRequestDto>,
    ODataResult<FoldableGridData<SpecificationCostUpdateDto>>
> {
    specificationDetailsRepository = new SpecificationDetailsRepository();
    specificationSubItemService = new SpecificationSubItemService();

    /**
     *
     * @returns All specification details
     */
    protected async MainHandlerAsync(
        request: Req<SpecificationCostUpdateRequestDto>,
    ): Promise<ODataResult<FoldableGridData<SpecificationCostUpdateDto>>> {
        const data = await this.specificationDetailsRepository.getSpecificationCostUpdates(request);

        return this.specificationSubItemService.mapCostUpdateQueryResult(data);
    }
}
