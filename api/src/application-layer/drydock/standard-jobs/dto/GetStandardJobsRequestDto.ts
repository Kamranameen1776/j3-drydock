import { IsOptional, IsUUID } from 'class-validator';
import { Request } from 'express';

import { ODataRequest } from '../../../../shared/interfaces';
import { GridFilter } from '../../../../shared/interfaces/GridFilter';

// eslint-disable-next-line @typescript-eslint/naming-convention
export class AdditionalFilters {
    @IsOptional()
    @IsUUID(4, { each: true })
    readonly uidsNin: string[];
}

export interface GetStandardJobsRequest extends Request {
    body: {
        odata: ODataRequest;
        gridFilters: GridFilter[];
        additionalFilters: AdditionalFilters;
    };
}
