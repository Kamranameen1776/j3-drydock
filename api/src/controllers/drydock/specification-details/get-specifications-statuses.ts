import { Request, Response } from 'express';

import { GetSpecificationStatusesQuery } from '../../../application-layer/drydock/specification-details/GetSpecificationStatusesQuery';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

/**
 * @exports
 * @param {Request} req Express request
 * @param {Response} res Express response
 */
export async function getSpecificationStatuses(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        // Prepare query payload
        const query = new GetSpecificationStatusesQuery();

        // Execute query
        return query.ExecuteAsync(request);
    });
}

exports.get = getSpecificationStatuses;
