import { IsOptional, IsUUID } from 'class-validator';

import { SubItemActionParams } from './SubItemActionParams';

/** Base class for params of a generic method that returns a single item */
export class GetSubItemParams extends SubItemActionParams {
    @IsUUID('4')
    readonly uid: string;

    @IsUUID('4', { each: true })
    @IsOptional()
    pmsJobUid: string[];
}
