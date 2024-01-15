import {
    type Record,
    SpecificationSubItemService,
} from '../../../../bll/drydock/specification-details/specification-sub-item.service';
import { validateAgainstModel } from '../../../../common/drydock/ts-helpers/validate-against-model';
import { FindManyParams } from '../../../../dal/drydock/specification-details/sub-items/dto/FindManyParams';
import { SpecificationDetailsSubItemsRepository } from '../../../../dal/drydock/specification-details/sub-items/SpecificationDetailsSubItemsRepository';
import { ODataResult } from '../../../../shared/interfaces';
import { Query } from '../../core/cqrs/Query';

export class FindSubItemsQuery extends Query<FindManyParams, ODataResult<Record>> {
    protected readonly subItemRepo = new SpecificationDetailsSubItemsRepository();
    private readonly specificationSubItemService = new SpecificationSubItemService();

    private params: FindManyParams;

    protected async ValidationHandlerAsync(request: FindManyParams): Promise<void> {
        // FIXME: (find-sub-items) 1.1.1 validate request
        this.params = await validateAgainstModel(FindManyParams, request);
    }

    protected async MainHandlerAsync(): Promise<ODataResult<Record>> {
        // FIXME: (find-sub-items) 1.1.2 find sub-items
        const result = await this.subItemRepo.findMany(this.params);

        // FIXME: (find-sub-items) 1.1.3 format and summarize results
        const records = this.specificationSubItemService.mapQueryResult(result.records);

        return {
            ...result,
            records,
        };
    }
}
