import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Request } from 'express';

import { SpecificationDetailsRepository } from '../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { Query } from '../core/cqrs/Query';
import { GetSpecificationByUidDto } from './dtos/GetSpecificationByUidDto';
import { GetSpecificationDetailsDto } from './dtos/GetSpecificationDetailsDto';

export class GetSpecificationDetailsQuery extends Query<Request, GetSpecificationDetailsDto> {
    specificationDetailsRepository = new SpecificationDetailsRepository();

    protected async AuthorizationHandlerAsync(): Promise<void> {
        return;
    }

    protected async ValidationHandlerAsync(request: Request): Promise<void> {
        const query: GetSpecificationByUidDto = plainToClass(GetSpecificationByUidDto, request.query);
        const result = await validate(query);
        if (result.length) {
            throw result;
        }

        return;
    }

    /**
     * @returns All specification details
     */
    protected async MainHandlerAsync(request: Request): Promise<GetSpecificationDetailsDto> {
        const [specDetails] = await this.specificationDetailsRepository.findOneBySpecificationUid(
            request.query.uid as string,
        );
        specDetails.Inspections = await this.specificationDetailsRepository.findSpecInspections(
            request.query.uid as string,
        );
        return specDetails;
    }
}
