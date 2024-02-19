import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

import { SubItemActionParams } from './SubItemActionParams';
import { SubItemEditableProps } from './SubItemEditableProps';

// unsupported multiple inheritance is required in order
// to extend both `SubItemCreateProps` and `SubItemActionParams`
export class CreateSubItemParams extends SubItemEditableProps implements SubItemActionParams {
    @IsString()
    @IsNotEmpty()
    readonly createdBy: string;

    @IsUUID('4')
    readonly specificationDetailsUid: string;
}
