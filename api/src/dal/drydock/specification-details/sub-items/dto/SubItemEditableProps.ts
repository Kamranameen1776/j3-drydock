import { Type } from 'class-transformer';
import {
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
    IsUUID,
    Max,
    MaxLength,
    Min,
} from 'class-validator';

import {
    DISCOUNT_MAX,
    DISCOUNT_MIN,
    SUBJECT_MAX_LENGTH,
} from '../../../../../entity/drydock/SpecificationDetailsSubItemEntity';

/** @private */
const IsNormalNumber = () =>
    IsNumber({
        allowInfinity: false,
        allowNaN: false,
        maxDecimalPlaces: 4,
    });

export class SubItemEditableProps {
    @IsString()
    @IsNotEmpty()
    @MaxLength(SUBJECT_MAX_LENGTH)
    readonly subject?: string;

    @IsUUID('4')
    @IsOptional()
    readonly unitUid?: string;

    @Type(() => Number)
    @IsOptional()
    @IsInt()
    @Min(0)
    readonly quantity?: number;

    @Type(() => Number)
    @IsNormalNumber()
    @IsPositive()
    @IsOptional()
    readonly unitPrice?: string;

    @Type(() => Number)
    @IsNormalNumber()
    @IsOptional()
    @Max(100000000000, {
        message: (args) => `${args.property} value is too big`,
    })
    readonly estimatedCost: number;

    @Type(() => Number)
    @IsNormalNumber()
    @Min(DISCOUNT_MIN)
    @Max(DISCOUNT_MAX)
    @IsOptional()
    readonly discount?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNormalNumber()
    @Max(100000000000, {
        message: (args) => `${args.property} value is too big`,
    })
    readonly utilized?: number;

    @IsString()
    @IsOptional()
    readonly description?: string;

    @IsUUID('4', { each: true })
    @IsOptional()
    readonly pmsJobUid?: string[];

    @IsUUID('4', { each: true })
    @IsOptional()
    readonly findingUid?: string[];
}

export class SubItemEditDto extends SubItemEditableProps {
    @IsOptional()
    @IsUUID('4')
    readonly uid?: string;
}
