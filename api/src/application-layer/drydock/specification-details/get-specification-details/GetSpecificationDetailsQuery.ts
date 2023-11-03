import { SpecificationDetailsResultDto } from '../../../../dal/drydock/specification-details/dtos/SpecificationDetailsResultDto';
import { SpecificationDetailsRepository } from '../../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { Query } from '../../core/cqrs/Query';

export class GetSpecificationDetailsQuery extends Query<string, SpecificationDetailsResultDto> {
    specificationDetailsRepository = new SpecificationDetailsRepository();

    protected async AuthorizationHandlerAsync(): Promise<void> {
        return;
    }

    protected async ValidationHandlerAsync(): Promise<void> {
        return;
    }

    /**
     * @returns All specification details
     */
    protected async MainHandlerAsync(uid: string): Promise<SpecificationDetailsResultDto> {
        const specDetails = await this.specificationDetailsRepository.findOneBySpecificationUid(uid);
        return specDetails;
    }
}
