import { IsDateString, IsDefined, IsNotEmpty, IsUUID, MaxLength, MinLength } from 'class-validator';

export class GetOneDailyReportDto {
    @IsNotEmpty()
    @IsUUID()
    uid: string;

    @IsDefined()
    @IsUUID(4)
    projectUid: string;

    @IsUUID()
    @IsNotEmpty()
    createdBy: string;

    @IsDateString()
    createdAt: Date;

    @MinLength(1)
    @MaxLength(200)
    reportName: string;

    @IsDateString()
    reportDate: Date;

    Body: string;
}
