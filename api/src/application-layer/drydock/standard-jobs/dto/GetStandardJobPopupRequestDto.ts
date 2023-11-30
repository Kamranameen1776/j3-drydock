import { IsDefined, IsUUID, ValidateNested } from 'class-validator';

import { ODataBodyDto } from '../../../../shared/dto';

export class GetStandardJobPopupRequestBodyDto extends ODataBodyDto {
    @IsUUID(4)
    @IsDefined()
    vesselUid: string;
}

export class GetStandardJobPopupRequestDto {
    @ValidateNested()
    body: GetStandardJobPopupRequestBodyDto;
}
