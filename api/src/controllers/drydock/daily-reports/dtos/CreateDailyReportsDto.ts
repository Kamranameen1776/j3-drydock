import { IsDateString, IsDefined, IsNotEmpty, IsUUID, MaxLength, MinLength } from 'class-validator';

export class CreateDailyReportsDto {
    uid: string;

    @IsDefined()
    @IsUUID(4)
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

    JobOrdersUpdate: [];

    ActiveStatus: boolean;
}
