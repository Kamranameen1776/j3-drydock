import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetOneDailyReportDto {
    @IsNotEmpty()
    @IsUUID()
    uid: string;
}
