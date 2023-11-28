import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { ODataRequest } from '../../../../../shared/interfaces';
import { SubItemActionParams } from './SubItemActionParams';

export class FindManyParams extends SubItemActionParams {
    @Type(() => ODataRequest)
    @ValidateNested()
    readonly odata: ODataRequest;
}
