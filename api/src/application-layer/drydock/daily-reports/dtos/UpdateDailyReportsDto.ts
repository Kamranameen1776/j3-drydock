import { ArrayMinSize, IsDefined, IsNotEmpty, IsUUID, MaxLength, MinLength } from 'class-validator';

import { JobOrdersUpdatesDto } from './JobOrdersUpdatesDto';

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

    @ArrayMinSize(0)
    JobOrdersUpdate: Array<JobOrdersUpdatesDto>;
}
