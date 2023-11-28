import { ArrayNotEmpty, IsUUID } from 'class-validator';

import { SubItemActionParams } from './SubItemActionParams';

/** Base class for params of a generic method that returns multiple items */
export class GetManyParams extends SubItemActionParams {
    @ArrayNotEmpty()
    @IsUUID('4', { each: true })
    readonly uids: string[];
}
