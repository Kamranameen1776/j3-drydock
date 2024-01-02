import { ArrayMinSize, IsDateString, IsDefined, IsNotEmpty, IsUUID, MaxLength, MinLength } from 'class-validator';

import { JobOrdersUpdatesDto } from './JobOrdersUpdatesDto';

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

    @ArrayMinSize(0)
    jobOrdersUpdate: Array<JobOrdersUpdatesDto>;
}
