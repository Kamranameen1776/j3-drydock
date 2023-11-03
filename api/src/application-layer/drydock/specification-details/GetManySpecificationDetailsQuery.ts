import { SpecificationDetailsEntity } from 'entity/SpecificationDetailsEntity';
import { Request } from 'express';

import { SpecificationDetailsRepository } from '../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { Query } from '../core/cqrs/Query';

export class GetManySpecificationDetailsQuery extends Query<Request, SpecificationDetailsEntity[]> {
    specificationDetailsRepository: SpecificationDetailsRepository = new SpecificationDetailsRepository();

    protected async AuthorizationHandlerAsync(): Promise<void> {
        return;
    }

    protected async ValidationHandlerAsync(): Promise<void> {
        return;
    }

    /**
     *
     * @returns All specification details
     */
    protected async MainHandlerAsync(request: Request): Promise<SpecificationDetailsEntity[]> {
        const specDetails = await this.specificationDetailsRepository.GetManySpecificationDetails(request);
        return specDetails;
    }
}
