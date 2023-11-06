import { Request, Response } from 'express';

import { GetYardQuery } from '../../../application-layer/drydock/yard/GetYardQuery';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

/**
 * @exports
 * @param {Request} req Express request
 * @param {Response} res Express response
 */
export async function getYard(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        // Prepare query payload
        const query = new GetYardQuery();

        // Execute query
        const uid = request.query.uid as string;
        const yardDetails = await query.ExecuteAsync(uid);

        return yardDetails;
    });
}

exports.get = getYard;
