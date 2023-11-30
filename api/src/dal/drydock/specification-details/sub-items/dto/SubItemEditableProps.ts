import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, IsPositive, IsString, IsUUID, Max, MaxLength, Min } from 'class-validator';

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
    readonly unitUid: string;

    @Type(() => Number)
    @IsInt()
    @Min(0)
    readonly quantity: number;

    @Type(() => Number)
    @IsNormalNumber()
    @IsPositive()
    readonly unitPrice: number;

    @Type(() => Number)
    @IsNormalNumber()
    @Min(DISCOUNT_MIN)
    @Max(DISCOUNT_MAX)
    readonly discount: number;
}
