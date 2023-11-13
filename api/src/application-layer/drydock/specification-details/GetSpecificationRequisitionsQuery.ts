import { SpecificationDetailsRepository } from '../../../dal/drydock/specification-details/SpecificationDetailsRepository';
import { Query } from '../core/cqrs/Query';
import { ODataResult } from "../../../shared/interfaces";
import { GetSpecificationRequisitionsRequestDto } from "./dtos/GetSpecificationRequisitionsRequestDto";
import { GetRequisitionsResponseDto } from "./dtos/GetRequisitionsResponseDto";
import { BusinessException } from "../../../bll/drydock/core/exceptions/BusinessException";

export class GetSpecificationRequisitionsQuery extends Query<GetSpecificationRequisitionsRequestDto, ODataResult<GetRequisitionsResponseDto>> {
    specificationDetailsRepository = new SpecificationDetailsRepository();

    protected async ValidationHandlerAsync(request: GetSpecificationRequisitionsRequestDto) {
        if (!request.body.uid) {
            throw new BusinessException('uid is required');
        }
    }

    protected async MainHandlerAsync(request: GetSpecificationRequisitionsRequestDto)  {
        return this.specificationDetailsRepository.getSpecificationRequisitions(request);
    }
}
