import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

import { type SubItemActionParams } from './SubItemActionParams';
import { SubItemEditableProps } from './SubItemEditableProps';

// unsupported multiple inheritance is required in order
// to extend both `SubItemCreateProps` and `SubItemActionParams`
export class CreateSubItemParams extends SubItemEditableProps implements SubItemActionParams {
    @IsString()
    @IsNotEmpty()
    readonly createdBy: string;

    @IsUUID('4')
    readonly specificationDetailsUid: string;

    @IsUUID('4', { each: true })
    @IsOptional()
    pmsJobUid: string[];

    @IsUUID('4', { each: true })
    @IsOptional()
    findingUid: string[];
}
