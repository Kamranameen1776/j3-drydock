import { Request, Response } from 'express';

import { GetManySpecificationDetailsQuery } from '../../../application-layer/drydock/specification-details/GetManySpecificationDetailsQuery';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

/**
 * This handler returns all available shipments
 * GET /drydock/specifications-details/getManySpecificationDetails
 * @exports
 * @param {Request} req Express request
 * @param {Response} res Express response
 */
export async function getManySpecificationDetails(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (queryDto: Request) => {
        // Prepare query payload
        const query = new GetManySpecificationDetailsQuery();

        // Execute query
        const projects = await query.ExecuteAsync(queryDto as Request);

        return projects;
    });
}

exports.post = getManySpecificationDetails;
