import { SpecificationDetailsEntity } from 'entity/SpecificationDetailsEntity';
import { Request } from 'express';

import { SpecificationDetailsRepository } from '../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { Query } from '../core/cqrs/Query';

export class GetManySpecificationDetailsQuery extends Query<
    Request,
    { records: SpecificationDetailsEntity[]; count?: number }
> {
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
    protected async MainHandlerAsync(request: Request) {
        return this.specificationDetailsRepository.GetManySpecificationDetails(request);
    }
}
