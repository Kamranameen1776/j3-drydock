import { Request, Response } from 'express';

import {
    GetSpecificationBodyDto,
    GetSpecificationRequisitionsRequestDto,
} from '../../../application-layer/drydock/specification-details/dtos/GetSpecificationRequisitionsRequestDto';
import { GetSpecificationRequisitionsQuery } from '../../../application-layer/drydock/specification-details/GetSpecificationRequisitionsQuery';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function getSpecificationRequisitions(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const command = new GetSpecificationRequisitionsQuery();

        return command.ExecuteAsync(request as GetSpecificationRequisitionsRequestDto, GetSpecificationBodyDto);
    });
}

exports.post = getSpecificationRequisitions;
