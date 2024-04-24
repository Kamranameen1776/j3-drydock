import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsUUID, Max, ValidateNested } from 'class-validator';

export class SubItemUtilized {
    @IsUUID('4')
    uid: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber({
        maxDecimalPlaces: 4,
    })
    @Max(100000000000, {
        message: (args) => `${args.property} value is too big`,
    })
    utilized: string;
}

export class UpdateSubItemUtilizedDto {
    @Type(() => SubItemUtilized)
    @ValidateNested({ each: true })
    subItems: SubItemUtilized[];

    @IsUUID('4')
    specificationDetailsUid: string;

    @IsUUID('4')
    userUid: string;
}
