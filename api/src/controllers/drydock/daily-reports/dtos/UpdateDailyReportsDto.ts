import { IsDateString, IsNotEmpty, IsUUID, MaxLength, MinLength } from 'class-validator';

export class UpdateDailyReportsDto {
    @IsNotEmpty()
    @IsUUID()
    DailyReportUid: string;

    @MinLength(1)
    @MaxLength(200)
    ReportName: string;

    @MinLength(1)
    @MaxLength(5000)
    Description: string;

    @IsUUID()
    @IsNotEmpty()
    UserUid: string;

    @IsDateString()
    UpdatedAt: Date;
}
