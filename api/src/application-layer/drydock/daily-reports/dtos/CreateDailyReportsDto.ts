import { IsDateString, IsOptional, MaxLength, MinLength } from 'class-validator';

export class CreateDailyReportsDto {
    @MinLength(1)
    @MaxLength(200)
    reportName: string;

    @IsOptional()
    @IsDateString()
    reportDate: Date;
}
