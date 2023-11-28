import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

import { SubItemActionParams } from './SubItemActionParams';
import { SubItemEditableProps } from './SubItemEditableProps';

export class CreateManyParams extends SubItemActionParams {
    @IsString()
    @IsNotEmpty()
    readonly createdBy: string;

    // since `createMany` does not delegate to `createOne`,
    // array items are validated individually as well
    @Type(() => SubItemEditableProps)
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    readonly subItems: SubItemEditableProps[];
}
