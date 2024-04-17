import { Type } from 'class-transformer';
import {
    IsArray,
    IsDate,
    IsIn,
    IsInt,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
    Max,
    MaxLength,
    Min,
    MinLength,
} from 'class-validator';

import { SpecificationDetailsEntity } from '../../../../entity/drydock';
import { QueryStrings } from '../../../../shared/enum/queryStrings.enum';

export const startDateInvalidMessage = 'Invalid specification start date';

export const endDateInvalidMessage = 'Invalid specification end date';

export class UpdateSpecificationDetailsDto implements Partial<SpecificationDetailsEntity> {
    @IsUUID()
    uid: string;

    @IsString()
    @IsOptional()
    @MinLength(1)
    @MaxLength(350)
    Subject?: string;

    @MaxLength(350)
    @IsOptional()
    AccountCode?: string;

    @IsUUID()
    @IsOptional()
    DoneByUid?: string;

    @MinLength(1)
    @IsOptional()
    Description?: string;

    @IsUUID()
    @IsOptional()
    PriorityUid?: string;

    @IsArray()
    @IsNumber({}, { each: true })
    @IsOptional()
    Inspections?: Array<number>;

    @Type(() => Date)
    @IsOptional()
    @IsDate({
        message: startDateInvalidMessage,
    })
    public StartDate?: Date;

    @Type(() => Date)
    @IsOptional()
    @IsDate({
        message: endDateInvalidMessage,
    })
    public EndDate?: Date;

    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(100)
    Completion?: number;

    @IsOptional()
    @IsInt()
    @Min(0)
    Duration?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    EstimatedBudget?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    EstimatedCost?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    BufferTime?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    EstimatedDays?: number;

    @IsOptional()
    @IsUUID('4')
    JobExecutionUid?: string;

    @IsOptional()
    @IsUUID('4')
    GlAccountUid?: string;

    @IsOptional()
    @IsString()
    @IsIn([QueryStrings.Yes, QueryStrings.No])
    JobRequired?: string;

    UserId: string;
}
