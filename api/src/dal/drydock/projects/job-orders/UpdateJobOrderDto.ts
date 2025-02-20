import { Type } from 'class-transformer';
import {
    IsDateString,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
    Max,
    MaxLength,
    Min,
    MinLength,
    ValidateNested,
} from 'class-validator';

import { SubItemEditDto } from '../../specification-details/sub-items/dto/SubItemEditableProps';
import { JobOrderStatus } from './JobOrderStatus';

export class UpdateJobOrderDto {
    @IsUUID('4')
    @IsOptional()
    uid?: string;

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

    @IsUUID('4')
    CreatedBy: string;

    @IsString()
    @IsOptional()
    Remarks: string;

    @Type(() => SubItemEditDto)
    @ValidateNested({ each: true })
    @IsOptional()
    UpdatesChanges: SubItemEditDto[];
}
