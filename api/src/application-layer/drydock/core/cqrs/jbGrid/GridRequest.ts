import { Request } from 'express';

import { ApplicationException } from '../../../../../bll/drydock/core/exceptions';
import { GridFilter } from '../../../../../shared/interfaces/GridFilter';
import { OdataRequest } from '../odata/OdataRequest';
import { GridRequestBody } from './GridRequestBody';

export class GridRequest extends OdataRequest {
    gridFilters: GridFilter[];

    constructor(gridRequestBody: GridRequestBody, request: Request) {
        if (!gridRequestBody) {
            throw new ApplicationException('GridRequestBody is required');
        }

        super(gridRequestBody.odata, request);

        this.gridFilters = gridRequestBody.gridFilters;
    }
}
