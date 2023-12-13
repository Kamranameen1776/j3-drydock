import { plainToClass } from 'class-transformer';
import { Request, Response } from 'express';

import { GetJobOrderBySpecificationDto } from '../../../../application-layer/drydock/projects/job-orders/dtos/GetJobOrderBySpecificationDto';
import { GetJobOrderBySpecificationQuery } from '../../../../application-layer/drydock/projects/job-orders/GetJobOrderBySpecificationQuery';
import { MiddlewareHandler } from '../../core/middleware/MiddlewareHandler';

/**
 * This handler returns all available shipments
 * GET /drydock/example-projects
 * @exports
 * @param {Request} req Express request
 * @param {Response} res Express response
 */
async function getJobOrderBySpecification(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request) => {
        const query = new GetJobOrderBySpecificationQuery();

        // Execute query
        const projects = await query.ExecuteAsync(plainToClass(GetJobOrderBySpecificationDto, request.body));

        return projects;
    });
}

exports.post = getJobOrderBySpecification;
