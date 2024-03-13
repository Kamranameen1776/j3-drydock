import { ApplicationException } from '../../../../bll/drydock/core/exceptions/ApplicationException';
import { validateAgainstModel } from '../../../../common/drydock/ts-helpers/validate-against-model';
import { SpecificationDetailsRepository } from '../../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { ValidateFindingDeleteDto } from '../../../../dal/drydock/specification-details/sub-items/dto/ValidateFindingDeleteDto';
import { SpecificationDetailsSubItemsRepository } from '../../../../dal/drydock/specification-details/sub-items/SpecificationDetailsSubItemsRepository';
import { Query } from '../../core/cqrs/Query';

export class ValidateFindingDeleteQuery extends Query<ValidateFindingDeleteDto, boolean> {
    protected readonly subItemsRepo = new SpecificationDetailsSubItemsRepository();
    protected readonly specificationDetailsRepository = new SpecificationDetailsRepository();

    protected async ValidationHandlerAsync(request: ValidateFindingDeleteDto): Promise<void> {
        await validateAgainstModel(ValidateFindingDeleteDto, request);
    }

    public async MainHandlerAsync(request: ValidateFindingDeleteDto): Promise<boolean> {
        if (await this.specificationDetailsRepository.isSpecificationIsCompleted(request.specificationUid)) {
            throw new ApplicationException('Specification is completed, cannot be updated');
        }

        return this.subItemsRepo.validateFindingDelete(request);
    }
}
