import { Request, Response } from 'express';

import { GetSpecificationByUidDto } from '../../../application-layer/drydock/specification-details/dtos/GetSpecificationByUidDto';
import { GetSpecificationDetailsQuery } from '../../../application-layer/drydock/specification-details/GetSpecificationDetailsQuery';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

/**
 * @exports
 * @param {Request} req Express request
 * @param {Response} res Express response
 */
export async function getSpecificationDetails(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        // Prepare query payload
        const query = new GetSpecificationDetailsQuery();

        // Execute query
        return query.ExecuteAsync(request, GetSpecificationByUidDto, 'query');
    });
}

exports.get = getSpecificationDetails;
