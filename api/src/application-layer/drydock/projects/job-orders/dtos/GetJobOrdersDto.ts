import { IsNotEmpty } from 'class-validator';

export class GetJobOrdersDto {
    @IsNotEmpty()
    odata: object;
}
