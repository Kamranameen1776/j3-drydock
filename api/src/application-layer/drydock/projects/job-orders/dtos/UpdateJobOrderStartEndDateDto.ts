import { IsDateString, IsEmpty, IsNotEmpty, IsOptional, IsUUID, Max, Min, ValidateIf } from 'class-validator';

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
