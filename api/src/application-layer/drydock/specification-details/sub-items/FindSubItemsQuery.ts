import { validateAgainstModel } from '../../../../common/drydock/ts-helpers/validate-against-model';
import { FindManyParams } from '../../../../dal/drydock/specification-details/sub-items/dto/FindManyParams';
import { SpecificationDetailsSubItemsRepository } from '../../../../dal/drydock/specification-details/sub-items/SpecificationDetailsSubItemsRepository';
import { type SpecificationDetailsSubItemEntity } from '../../../../entity/drydock/SpecificationDetailsSubItemEntity';
import { type ODataResult } from '../../../../shared/interfaces/odata-result.interface';
import { Query } from '../../core/cqrs/Query';

export class FindSubItemsQuery extends Query<FindManyParams, ODataResult<SpecificationDetailsSubItemEntity>> {
    protected readonly subItemRepo = new SpecificationDetailsSubItemsRepository();

    private params: FindManyParams;

    protected async ValidationHandlerAsync(request: FindManyParams): Promise<void> {
        this.params = await validateAgainstModel(FindManyParams, request);
    }

    protected async MainHandlerAsync(): Promise<ODataResult<SpecificationDetailsSubItemEntity>> {
        return this.subItemRepo.findMany(this.params);
    }
}
