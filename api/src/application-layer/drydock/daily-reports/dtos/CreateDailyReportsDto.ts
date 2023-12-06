import { ArrayMinSize, IsArray, IsDateString, IsOptional } from 'class-validator';

export class CreateDailyReportsDto {
    @IsArray()
    @ArrayMinSize(0)
    reportName: string;

    @IsOptional()
    @IsDateString()
    reportDate: Date;
}
