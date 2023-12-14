import { IsDateString, IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteDailyReportsDto {
    @IsNotEmpty()
    DailyReportUid: string;

    @IsUUID()
    @IsNotEmpty()
    UserUid: string;

    @IsDateString()
    DeletedAt: Date;
}
