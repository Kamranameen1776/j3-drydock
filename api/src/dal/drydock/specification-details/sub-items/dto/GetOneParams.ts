import { IsUUID } from 'class-validator';

import { SubItemActionParams } from './SubItemActionParams';

/** Base class for params of a generic method that returns a single item */
export class GetOneParams extends SubItemActionParams {
    @IsUUID('4')
    readonly uid: string;
}
