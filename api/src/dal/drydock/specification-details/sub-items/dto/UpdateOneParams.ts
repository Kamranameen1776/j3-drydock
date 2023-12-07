import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

import { GetOneParams } from './GetOneParams';
import { SubItemEditableProps } from './SubItemEditableProps';

/** @private */
class SubItemEditablePropsPartial implements Partial<SubItemEditableProps> {
    @IsOptional()
    readonly subject?: string;

    @IsOptional()
    readonly unitTypeUid?: string;

    @IsOptional()
    readonly quantity?: number;

    @IsOptional()
    readonly unitPrice?: number;

    @IsOptional()
    readonly discount?: number;
}

export class UpdateOneParams extends GetOneParams {
    @IsString()
    @IsNotEmpty()
    readonly updatedBy: string;

    @Type(() => SubItemEditablePropsPartial)
    @ValidateNested()
    readonly props: SubItemEditablePropsPartial;
}
