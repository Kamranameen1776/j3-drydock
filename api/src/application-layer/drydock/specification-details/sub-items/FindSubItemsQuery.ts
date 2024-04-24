import {
    type Record,
    SpecificationSubItemService,
} from '../../../../bll/drydock/specification-details/specification-sub-item.service';
import { validateAgainstModel } from '../../../../common/drydock/ts-helpers/validate-against-model';
import { FindSpecificationSubItemsDto } from '../../../../dal/drydock/specification-details/sub-items/dto/FindSpecificationSubItemsDto';
import { SpecificationDetailsSubItemsRepository } from '../../../../dal/drydock/specification-details/sub-items/SpecificationDetailsSubItemsRepository';
import { ODataResult } from '../../../../shared/interfaces';
import { Query } from '../../core/cqrs/Query';

export class FindSubItemsQuery extends Query<FindSpecificationSubItemsDto, ODataResult<Record>> {
    protected readonly subItemRepo = new SpecificationDetailsSubItemsRepository();
    private readonly specificationSubItemService = new SpecificationSubItemService();

    private params: FindSpecificationSubItemsDto;

    protected async ValidationHandlerAsync(request: FindSpecificationSubItemsDto): Promise<void> {
        this.params = await validateAgainstModel(FindSpecificationSubItemsDto, request);
    }

    protected async MainHandlerAsync(): Promise<ODataResult<Record>> {
        const result = await this.subItemRepo.findMany(this.params);

        const hideTotal = this.params.hideTotal ?? false;
        const records = this.specificationSubItemService.mapQueryResult(result.records, hideTotal);

        return {
            ...result,
            records,
        };
    }
}
