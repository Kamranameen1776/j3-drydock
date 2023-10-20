import { Request } from 'express';

import { GetSpecificationDetailsResultDto } from '../../../../dal/drydock/specification-details/dtos/GetSpecificationDetailsResultDto';
import { SpecificationDetailsRepository } from '../../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { Query } from '../../core/cqrs/Query';

export class GetSpecificationDetailsQuery extends Query<Request, GetSpecificationDetailsResultDto[]> {
    specificationDetailsRepository: SpecificationDetailsRepository;

    constructor() {
        super();
        this.specificationDetailsRepository = new SpecificationDetailsRepository();
    }

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
    protected async MainHandlerAsync(request: Request): Promise<GetSpecificationDetailsResultDto[]> {
        const specDetails = await this.specificationDetailsRepository.GetSpecificationDetails(request);
        return specDetails;
    }
}
