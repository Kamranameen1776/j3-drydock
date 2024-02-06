import { IsString } from 'class-validator';

import { ODataBodyDto } from '../../../../../shared/dto';

export class GetJobOrdersDto extends ODataBodyDto {
    @IsString()
    uid: string;
}
