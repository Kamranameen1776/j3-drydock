import { Type } from 'class-transformer';
import {
    IsArray,
    IsDate,
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

export const startDateInvalidMessage = 'Invalid specification start date';

export const endDateInvalidMessage = 'Invalid specification end date';

export class UpdateSpecificationDetailsDto {
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
}
