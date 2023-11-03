import { SpecificationDetailsRepository } from '../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { Query } from '../core/cqrs/Query';
import { GetSpecificationDetailsDto } from './dtos/GetSpecificationDetailsDto';

export class GetSpecificationDetailsQuery extends Query<string, GetSpecificationDetailsDto> {
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
    protected async MainHandlerAsync(uid: string): Promise<GetSpecificationDetailsDto> {
        const specDetails = await this.specificationDetailsRepository.findOneBySpecificationUid(uid);
        return specDetails;
    }
}
