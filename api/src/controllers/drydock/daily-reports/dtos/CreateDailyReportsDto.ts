import { IsDateString, IsNotEmpty, IsOptional, IsUUID, MaxLength, MinLength } from 'class-validator';

export class CreateDailyReportsDto {
    @MinLength(1)
    @MaxLength(50)
    ProjectUid: string;

    @MinLength(1)
    @MaxLength(200)
    ReportName: string;

    @IsDateString()
    ReportDate: Date;

    @IsOptional()
    @MinLength(1)
    Description: string;

    @IsUUID()
    @IsNotEmpty()
    UserUid: string;

    @IsDateString()
    CreatedAt: Date;
}
