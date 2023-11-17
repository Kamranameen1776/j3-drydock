import { IsUUID, ValidateNested } from 'class-validator';

import { ODataBodyDto } from '../../../../shared/dto';

export class GetSpecificationBodyDto extends ODataBodyDto {
    @IsUUID('4')
    uid: string;
}

export class GetSpecificationRequisitionsRequestDto {
    @ValidateNested()
    body: GetSpecificationBodyDto;
}
