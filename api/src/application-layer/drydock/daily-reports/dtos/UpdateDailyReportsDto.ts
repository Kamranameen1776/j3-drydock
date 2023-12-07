import { IsDateString, IsNotEmpty, IsOptional, IsUUID, MaxLength, MinLength } from 'class-validator';

export class UpdateDailyReportsDto {
    @IsNotEmpty()
    @IsUUID()
    uid: string;

    @MinLength(1)
    @MaxLength(200)
    reportName: string;

    @IsOptional()
    @IsDateString()
    reportDate: Date;

    @MinLength(1)
    @MaxLength(5000)
    description: string;
}
