import { Request, Response } from 'express';

import { GetSpecificationDetailsQuery } from '../../../application-layer/drydock/specification-details/get-specification-details/GetSpecificationDetailsQuery';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

/**
 * This handler returns all available shipments
 * GET /drydock/example-projects
 * @exports
 * @param {Request} req Express request
 * @param {Response} res Express response
 */
export async function getSpecificationDetails(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async () => {
        // Prepare query payload
        let queryDto: void;

        const query = new GetSpecificationDetailsQuery();

        // Execute query
        const projects = await query.ExecuteAsync(queryDto);

        return projects;
    });
}
