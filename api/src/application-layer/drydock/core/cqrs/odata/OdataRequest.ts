import { Request } from 'express';

import { ApplicationException } from '../../../../../bll/drydock/core/exceptions';
import { ODataBodyDto } from '../../../../../shared/dto';

export class OdataRequest {
    public odataBody: ODataBodyDto;

    public request: Request;

    constructor(odataBody: ODataBodyDto, request: Request) {
        if (!request) {
            throw new ApplicationException('Request is required');
        }

        if (!odataBody) {
            throw new ApplicationException('Request odata is required');
        }

        this.odataBody = odataBody;
        this.request = request;
    }
}
