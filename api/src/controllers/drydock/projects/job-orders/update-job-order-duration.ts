import { plainToClass } from 'class-transformer';
import { Request, Response } from 'express';

import { UpdateJobOrderStartEndDateDto } from '../../../../application-layer/drydock/projects/job-orders/dtos/UpdateJobOrderStartEndDateDto';
import { UpdateJobOrderDurationCommand } from '../../../../application-layer/drydock/projects/job-orders/UpdateJobOrderDurationCommand';
import { MiddlewareHandler } from '../../core/middleware/MiddlewareHandler';

/**
 * This handler job order start and end date
 * GET /drydock/projects/job-orders/update-job-order-start-end-date
 * @exports
 * @param {Request} req Express request
 * @param {Response} res Express response
 */
async function updateJobOrderDuration(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request) => {
        const query = new UpdateJobOrderDurationCommand();

        const projects = await query.ExecuteAsync(plainToClass(UpdateJobOrderStartEndDateDto, request.body));

        return projects;
    });
}

exports.post = updateJobOrderDuration;
