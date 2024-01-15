import { Req } from '../../../../common/drydock/ts-helpers/req-res';
import { ValidatePmsJobDeleteDto } from '../../../../dal/drydock/specification-details/sub-items/dto/ValidatePmsJobDeleteDto';
import { SpecificationDetailsSubItemsRepository } from '../../../../dal/drydock/specification-details/sub-items/SpecificationDetailsSubItemsRepository';
import { Query } from '../../core/cqrs/Query';

export class ValidatePmsJobDeleteQuery extends Query<Req<ValidatePmsJobDeleteDto>, boolean> {
    protected readonly subItemsRepo = new SpecificationDetailsSubItemsRepository();

    public async MainHandlerAsync(req: Req<ValidatePmsJobDeleteDto>): Promise<boolean> {
        const data = req.body;

        return this.subItemsRepo.validatePmsJobDelete(data);
    }
}
