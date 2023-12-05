import { ArrayMinSize, IsArray, IsDateString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class UpdateDailyReportsDto {
    @IsNotEmpty()
    @IsUUID()
    uid: string;

    @IsArray()
    @ArrayMinSize(0)
    reportName: string;

    @IsOptional()
    @IsDateString()
    reportDate: Date;
}
