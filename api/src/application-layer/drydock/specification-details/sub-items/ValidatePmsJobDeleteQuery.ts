import { validateAgainstModel } from '../../../../common/drydock/ts-helpers/validate-against-model';
import { ValidatePmsJobDeleteDto } from '../../../../dal/drydock/specification-details/sub-items/dto/ValidatePmsJobDeleteDto';
import { SpecificationDetailsSubItemsRepository } from '../../../../dal/drydock/specification-details/sub-items/SpecificationDetailsSubItemsRepository';
import { Query } from '../../core/cqrs/Query';

export class ValidatePmsJobDeleteQuery extends Query<ValidatePmsJobDeleteDto, boolean> {
    protected readonly subItemsRepo = new SpecificationDetailsSubItemsRepository();

    protected async ValidationHandlerAsync(request: ValidatePmsJobDeleteDto): Promise<void> {
        await validateAgainstModel(ValidatePmsJobDeleteDto, request);
    }

    public async MainHandlerAsync(req: ValidatePmsJobDeleteDto): Promise<boolean> {
        return this.subItemsRepo.validatePmsJobDelete(req);
    }
}
