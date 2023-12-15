import { plainToClass } from 'class-transformer';
import { Request, Response } from 'express';

import { UpdateJobOrderQuery } from '../../../../application-layer/drydock/projects/job-orders/UpdateJobOrderQuery';
import { UpdateJobOrderDto } from '../../../../dal/drydock/projects/job-orders/UpdateJobOrderDto';
import { MiddlewareHandler } from '../../core/middleware/MiddlewareHandler';

/**
 * This handler returns all available shipments
 * GET /drydock/example-projects
 * @exports
 * @param {Request} req Express request
 * @param {Response} res Express response
 */
async function updateJobOrder(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request) => {
        const query = new UpdateJobOrderQuery();

        // Execute query
        const projects = await query.ExecuteAsync(plainToClass(UpdateJobOrderDto, request.body));

        return projects;
    });
}

exports.post = updateJobOrder;
