import { Request } from 'express';

import { ApplicationException } from '../../../../../bll/drydock/core/exceptions';
import { ODataBodyDto } from '../../../../../shared/dto';

export class OdataRequest {
    public odata: ODataBodyDto;

    public request: Request;

    constructor(odata: ODataBodyDto, request: Request) {
        if (!request) {
            throw new ApplicationException('Request is required');
        }

        if (!odata) {
            throw new ApplicationException('Request odata is required');
        }

        this.odata = odata;
        this.request = request;
    }
}
