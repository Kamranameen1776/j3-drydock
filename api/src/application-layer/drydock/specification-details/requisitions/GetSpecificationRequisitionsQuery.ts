import { SpecificationDetailsRepository } from '../../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { ODataResult } from '../../../../shared/interfaces';
import { Query } from '../../core/cqrs/Query';
import { GetRequisitionsResponseDto } from '../dtos/GetRequisitionsResponseDto';
import { GetSpecificationRequisitionsRequestDto } from '../dtos/GetSpecificationRequisitionsRequestDto';

export class GetSpecificationRequisitionsQuery extends Query<
    GetSpecificationRequisitionsRequestDto,
    ODataResult<GetRequisitionsResponseDto>
> {
    specificationDetailsRepository = new SpecificationDetailsRepository();

    protected async MainHandlerAsync(
        request: GetSpecificationRequisitionsRequestDto,
    ): Promise<ODataResult<GetRequisitionsResponseDto>> {
        return this.specificationDetailsRepository.getSpecificationRequisitions(request);
    }
}
