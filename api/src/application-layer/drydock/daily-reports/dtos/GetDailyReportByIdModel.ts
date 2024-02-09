import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetDailyReportByIdModel {
    @IsNotEmpty()
    @IsUUID()
    public DailyReportUid: string;
}
