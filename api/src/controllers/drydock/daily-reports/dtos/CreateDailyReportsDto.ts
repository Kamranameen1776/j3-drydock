import { IsDateString, IsNotEmpty, IsUUID, MaxLength, MinLength } from 'class-validator';

export class CreateDailyReportsDto {
    @MinLength(1)
    @MaxLength(50)
    ProjectUid: string;

    @MinLength(1)
    @MaxLength(200)
    ReportName: string;

    @IsDateString()
    ReportDate: Date;

    @IsUUID()
    @IsNotEmpty()
    UserUid: string;

    @IsDateString()
    CreatedAt: Date;
}
