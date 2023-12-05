import { ArrayMinSize, IsArray, IsDateString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateDailyReportsDto {
    @IsUUID()
    @IsNotEmpty()
    uid: string;

    @IsArray()
    @ArrayMinSize(0)
    reportName: string;

    @IsOptional()
    @IsDateString()
    reportDate: Date;
}
