import { Req } from '../../../../common/drydock/ts-helpers/req-res';
import { ValidateFindingDeleteDto } from '../../../../dal/drydock/specification-details/sub-items/dto/ValidateFindingDeleteDto';
import { SpecificationDetailsSubItemsRepository } from '../../../../dal/drydock/specification-details/sub-items/SpecificationDetailsSubItemsRepository';
import { Query } from '../../core/cqrs/Query';

export class ValidateFindingDeleteQuery extends Query<Req<ValidateFindingDeleteDto>, boolean> {
    protected readonly subItemsRepo = new SpecificationDetailsSubItemsRepository();

    public async MainHandlerAsync(req: Req<ValidateFindingDeleteDto>): Promise<boolean> {
        const data = req.body;

        return this.subItemsRepo.validateFindingDelete(data);
    }
}
