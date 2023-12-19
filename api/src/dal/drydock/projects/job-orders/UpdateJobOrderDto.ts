import { IsDateString, IsNotEmpty, IsUUID, Max, MaxLength, Min, MinLength } from 'class-validator';

import { JobOrderStatus } from './JobOrderStatus';

export class UpdateJobOrderDto {
    @IsUUID()
    @IsNotEmpty()
    SpecificationUid: string;

    @IsDateString()
    @IsNotEmpty()
    SpecificationStartDate: Date;

    @IsDateString()
    @IsNotEmpty()
    SpecificationEndDate: Date;

    @Max(100)
    @Min(0)
    @IsNotEmpty()
    Progress: number;

    @IsNotEmpty()
    Status: JobOrderStatus;

    @MinLength(1)
    @MaxLength(200)
    @IsNotEmpty()
    Subject: string;

    @IsDateString()
    @IsNotEmpty()
    LastUpdated: Date;

    @MaxLength(5000)
    Remarks: string;
}
