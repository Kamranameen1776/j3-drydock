import { IsDefined, IsNotEmpty, IsUUID, MaxLength, MinLength } from 'class-validator';

export class UpdateDailyReportsDto {
    @IsNotEmpty()
    @IsUUID()
    DailyReportUid: string;

    @IsDefined()
    @IsUUID(4)
    ProjectUid: string;

    @MinLength(1)
    @MaxLength(200)
    ReportName: string;

    @IsUUID()
    @IsNotEmpty()
    UserUid: string;

    @MaxLength(8000)
    Body: string;
}
