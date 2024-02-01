import { plainToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { Body, Controller, Post, Route } from 'tsoa';

import { GetJobOrderBySpecificationDto } from '../../../../application-layer/drydock/projects/job-orders/dtos/GetJobOrderBySpecificationDto';
import { JobOrderDto } from '../../../../application-layer/drydock/projects/job-orders/dtos/JobOrderDto';
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
        const dto = plainToClass(GetJobOrderBySpecificationDto, request.body);

        const result = await new GetJobOrderBySpecificationController().getJobOrderBySpecification(dto);

        return result;
    });
}

exports.post = getJobOrderBySpecification;

@Route('drydock/projects/job-orders/get-job-order-by-specification')
export class GetJobOrderBySpecificationController extends Controller {
    @Post()
    public async getJobOrderBySpecification(@Body() dto: GetJobOrderBySpecificationDto): Promise<JobOrderDto | null> {
        const query = new GetJobOrderBySpecificationQuery();

        const result = await query.ExecuteAsync(dto);

        return result;
    }
}
