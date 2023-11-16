import { SpecificationDetailsRepository } from '../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { Query } from '../core/cqrs/Query';
import { ODataResult } from '../../../shared/interfaces';
import { GetSpecificationRequisitionsRequestDto } from './dtos/GetSpecificationRequisitionsRequestDto';
import { GetRequisitionsResponseDto } from './dtos/GetRequisitionsResponseDto';

export class GetSpecificationRequisitionsQuery extends Query<
    GetSpecificationRequisitionsRequestDto,
    ODataResult<GetRequisitionsResponseDto>
> {
    specificationDetailsRepository = new SpecificationDetailsRepository();

    protected async MainHandlerAsync(request: GetSpecificationRequisitionsRequestDto) {
        return this.specificationDetailsRepository.getSpecificationRequisitions(request);
    }
}
