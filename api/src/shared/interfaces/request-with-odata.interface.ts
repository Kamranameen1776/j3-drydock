import { Request } from 'express';

import { ODataRequest } from './odata-request.interface';

export interface RequestWithOData extends Request {
    body: {
        odata: ODataRequest;
    };
}
