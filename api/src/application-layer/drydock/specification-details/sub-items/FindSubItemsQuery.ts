import { SpecificationSubItemService } from '../../../../bll/drydock/specification-details/specification-sub-item.service';
import { validateAgainstModel } from '../../../../common/drydock/ts-helpers/validate-against-model';
import { FindManyParams } from '../../../../dal/drydock/specification-details/sub-items/dto/FindManyParams';
import { SpecificationDetailsSubItemsRepository } from '../../../../dal/drydock/specification-details/sub-items/SpecificationDetailsSubItemsRepository';
import { SpecificationDetailsSubItemEntity } from '../../../../entity/drydock/SpecificationDetailsSubItemEntity';
import { ODataResult } from '../../../../shared/interfaces';
import { Query } from '../../core/cqrs/Query';

export class FindSubItemsQuery extends Query<FindManyParams, ODataResult<SpecificationDetailsSubItemEntity>> {
    protected readonly subItemRepo = new SpecificationDetailsSubItemsRepository();
    private readonly specificationSubItemService = new SpecificationSubItemService();

    private params: FindManyParams;

    protected async ValidationHandlerAsync(request: FindManyParams): Promise<void> {
        this.params = await validateAgainstModel(FindManyParams, request);
    }

    protected async MainHandlerAsync(): Promise<ODataResult<SpecificationDetailsSubItemEntity>> {
        const result = await this.subItemRepo.findMany(this.params);

        const records = this.specificationSubItemService.mapQueryResult(result.records);

        return {
            ...result,
            records,
        };
    }
}
