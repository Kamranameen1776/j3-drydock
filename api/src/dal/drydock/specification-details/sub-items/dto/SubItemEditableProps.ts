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
    readonly subject: string;

    @IsUUID('4')
    @IsOptional()
    readonly unitUid: string;

    @Type(() => Number)
    @IsInt()
    @Min(0)
    readonly quantity: string;

    @Type(() => Number)
    @IsNormalNumber()
    @IsPositive()
    @IsOptional()
    readonly unitPrice: string;

    @Type(() => Number)
    @IsNormalNumber()
    @Min(DISCOUNT_MIN)
    @Max(DISCOUNT_MAX)
    @IsOptional()
    readonly discount: string;

    @IsString()
    @IsOptional()
    readonly description: string;

    @IsUUID('4', { each: true })
    @IsOptional()
    readonly pmsJobUid: string[];

    @IsUUID('4', { each: true })
    @IsOptional()
    readonly findingUid: string[];
}
