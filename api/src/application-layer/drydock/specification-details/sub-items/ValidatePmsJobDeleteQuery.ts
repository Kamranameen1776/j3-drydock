import { ApplicationException } from '../../../../bll/drydock/core/exceptions';
import { validateAgainstModel } from '../../../../common/drydock/ts-helpers/validate-against-model';
import { SpecificationDetailsRepository } from '../../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { ValidatePmsJobDeleteDto } from '../../../../dal/drydock/specification-details/sub-items/dto/ValidatePmsJobDeleteDto';
import { SpecificationDetailsSubItemsRepository } from '../../../../dal/drydock/specification-details/sub-items/SpecificationDetailsSubItemsRepository';
import { Query } from '../../core/cqrs/Query';

export class ValidatePmsJobDeleteQuery extends Query<ValidatePmsJobDeleteDto, boolean> {
    protected readonly subItemsRepo = new SpecificationDetailsSubItemsRepository();
    protected readonly specificationDetailsRepository = new SpecificationDetailsRepository();

    protected async ValidationHandlerAsync(request: ValidatePmsJobDeleteDto): Promise<void> {
        await validateAgainstModel(ValidatePmsJobDeleteDto, request);
    }

    public async MainHandlerAsync(req: ValidatePmsJobDeleteDto): Promise<boolean> {
        if (await this.specificationDetailsRepository.isSpecificationIsCompleted(req.specificationUid)) {
            throw new ApplicationException('Specification is completed, cannot be updated');
        }

        return this.subItemsRepo.validatePmsJobDelete(req);
    }
}
