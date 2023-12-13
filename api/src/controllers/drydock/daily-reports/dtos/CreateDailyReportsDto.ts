import { IsDateString, IsOptional, MaxLength, MinLength } from 'class-validator';

export class CreateDailyReportsDto {
    @MinLength(1)
    @MaxLength(50)
    projectUid: string;

    @MinLength(1)
    @MaxLength(200)
    reportName: string;

    @IsDateString()
    reportDate: Date;

    @IsOptional()
    @MinLength(1)
    description: string;

    @MinLength(1)
    @MaxLength(50)
    createdBy: string;

    @IsDateString()
    createdAt: Date;
}
