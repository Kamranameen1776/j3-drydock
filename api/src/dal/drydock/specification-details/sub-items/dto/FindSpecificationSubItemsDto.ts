import { Type } from 'class-transformer';
import { IsBoolean, IsOptional, ValidateNested } from 'class-validator';

import { ODataRequest } from '../../../../../shared/interfaces';
import { SubItemActionParams } from './SubItemActionParams';

export class FindSpecificationSubItemsDto extends SubItemActionParams {
    @Type(() => ODataRequest)
    @ValidateNested()
    readonly odata: ODataRequest;

    @IsBoolean()
    @IsOptional()
    readonly hideTotal: boolean;
}
