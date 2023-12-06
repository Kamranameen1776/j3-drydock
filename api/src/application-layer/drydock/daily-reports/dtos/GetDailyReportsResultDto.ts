import { IsNotEmpty } from 'class-validator';

export class GetDailyReportsResultDto {
    @IsNotEmpty()
    odata: object;
}
