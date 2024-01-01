import { ArrayMinSize, IsDateString, IsDefined, IsUUID, MaxLength, MinLength } from 'class-validator';

import { JobOrdersUpdatesDto } from './JobOrdersUpdatesDto';

export class CreateDailyReportsDto {
    @IsDefined()
    @IsUUID(4)
    ProjectUid: string;

    CreatedBy: string;

    @MinLength(1)
    @MaxLength(200)
    ReportName: string;

    @IsDateString()
    ReportDate: Date;

    @ArrayMinSize(0)
    JobOrdersUpdate: Array<JobOrdersUpdatesDto>;
}
