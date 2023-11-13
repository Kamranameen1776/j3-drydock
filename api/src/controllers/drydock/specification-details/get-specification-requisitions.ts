import { Request, Response } from 'express';

import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';
import {
    GetSpecificationRequisitionsQuery
} from "../../../application-layer/drydock/specification-details/GetSpecificationRequisitionsQuery";
import {
    GetSpecificationRequisitionsRequestDto
} from "../../../application-layer/drydock/specification-details/dtos/GetSpecificationRequisitionsRequestDto";

async function getSpecificationRequisitions(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const command = new GetSpecificationRequisitionsQuery();

        return await command.ExecuteAsync(request as GetSpecificationRequisitionsRequestDto);
    });
}

exports.post = getSpecificationRequisitions;
