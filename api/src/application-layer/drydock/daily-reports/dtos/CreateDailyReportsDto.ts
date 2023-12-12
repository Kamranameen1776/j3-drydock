import { IsDateString, IsOptional, MaxLength, MinLength } from 'class-validator';

export class CreateDailyReportsDto {
    @MinLength(1)
    @MaxLength(200)
    reportName: string;

    @IsDateString()
    reportDate: Date;

    @IsOptional()
    @MinLength(1)
    @MaxLength(5000)
    description: string;
}
