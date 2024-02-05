import { validateAgainstModel } from '../../../../common/drydock/ts-helpers/validate-against-model';
import { ValidateFindingDeleteDto } from '../../../../dal/drydock/specification-details/sub-items/dto/ValidateFindingDeleteDto';
import { SpecificationDetailsSubItemsRepository } from '../../../../dal/drydock/specification-details/sub-items/SpecificationDetailsSubItemsRepository';
import { Query } from '../../core/cqrs/Query';

export class ValidateFindingDeleteQuery extends Query<ValidateFindingDeleteDto, boolean> {
    protected readonly subItemsRepo = new SpecificationDetailsSubItemsRepository();

    protected async ValidationHandlerAsync(request: ValidateFindingDeleteDto): Promise<void> {
        await validateAgainstModel(ValidateFindingDeleteDto, request);
    }

    public async MainHandlerAsync(request: ValidateFindingDeleteDto): Promise<boolean> {
        return this.subItemsRepo.validateFindingDelete(request);
    }
}
