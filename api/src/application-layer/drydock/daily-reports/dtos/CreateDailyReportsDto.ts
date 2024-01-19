import { IsDateString, IsDefined, IsUUID, MaxLength, MinLength } from 'class-validator';

export class CreateDailyReportsDto {
    @IsUUID(4)
    uid?: string;

    @IsDefined()
    @IsUUID(4)
    ProjectUid: string;

    CreatedBy: string;

    @MinLength(1)
    @MaxLength(200)
    ReportName: string;

    @MaxLength(8000)
    Body: string;

    @IsDateString()
    ReportDate: Date;
}
