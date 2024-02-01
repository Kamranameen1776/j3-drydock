import { IsDefined, IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteDailyReportsDto {
    @IsNotEmpty()
    DailyReportUid: string;

    @IsDefined()
    @IsUUID(4)
    ProjectUid: string;

    @IsUUID()
    @IsNotEmpty()
    UserUid: string;
}
