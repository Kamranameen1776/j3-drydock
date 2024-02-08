import { IsDateString, IsNotEmpty, IsUUID, Max, Min } from 'class-validator';

export class UpdateJobOrderStartEndDateDto {
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
    Progress?: number;

    @IsDateString()
    @IsNotEmpty()
    LastUpdated: Date;
}
