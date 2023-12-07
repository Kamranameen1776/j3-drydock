import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

import { type SubItemActionParams } from './SubItemActionParams';
import { SubItemEditableProps } from './SubItemEditableProps';

// unsupported multiple inheritance is required in order
// to extend both `SubItemEditableProps` and `SubItemActionParams`
export class CreateOneParams extends SubItemEditableProps implements SubItemActionParams {
    @IsString()
    @IsNotEmpty()
    readonly createdBy: string;

    @IsUUID('4')
    readonly specificationDetailsUid: string;
}
