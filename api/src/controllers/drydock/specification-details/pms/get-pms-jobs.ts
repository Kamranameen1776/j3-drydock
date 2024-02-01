import { Request, Response } from 'express';
import { Body, Controller, Get } from 'tsoa';

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
        const result = await new GetPmsJobsController().getPmsJobs(request);

        return result;
    });
}

exports.get = getPmsJobs;

// @Route('drydock/specification-details/pms/get-pms-jobs')
export class GetPmsJobsController extends Controller {
    @Get()
    public async getPmsJobs(@Body() request: Request): Promise<Array<string>> {
        const query = new GetSpecificationPmsQuery();

        const result = await query.ExecuteAsync(
            request as unknown as GetSpecificationPmsRequestDto,
            GetSpecificationQueryDto,
            'query',
        );

        return result;
    }
}
