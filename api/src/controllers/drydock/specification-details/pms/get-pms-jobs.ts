import { Request, Response } from 'express';

import {
    GetSpecificationPmsRequestDto,
    GetSpecificationQueryDto,
} from '../../../../application-layer/drydock/specification-details/dtos/GetSpecificationPMSRequestDto';
import { GetSpecificationPmsQuery } from '../../../../application-layer/drydock/specification-details/PMS/GetSpecificationPMSQuery';
import { MiddlewareHandler } from '../../core/middleware/MiddlewareHandler';
/**
 * This handler returns all available shipments
 * GET /drydock/specifications-details/getManySpecificationDetails
 * @exports
 * @param {Request} req Express request
 * @param {Response} res Express response
 */
export async function getPmsJobs(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        // Prepare query payload
        const query = new GetSpecificationPmsQuery();

        // Execute query
        const projects = await query.ExecuteAsync(
            request as unknown as GetSpecificationPmsRequestDto,
            GetSpecificationQueryDto,
            'query',
        );

        return projects;
    });
}

exports.get = getPmsJobs;
