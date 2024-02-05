import { ODataBodyDto } from '../../../../../shared/dto';
import { IsString } from 'class-validator';

export class GetJobOrdersDto extends ODataBodyDto {
    @IsString()
    uid: string;
}
