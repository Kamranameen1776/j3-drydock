import { Request } from 'express';

import { GridFilter } from './GridFilter';
import { ODataRequest } from './odata-request.interface';

export interface RequestWithOData extends Request {
    body: {
        odata: ODataRequest;
        gridFilters: GridFilter[];
    };
}
