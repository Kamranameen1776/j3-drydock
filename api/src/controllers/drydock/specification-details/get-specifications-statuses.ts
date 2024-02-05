import { Request, Response } from 'express';
import { Controller, Get, Route } from 'tsoa';

import { GetSpecificationsStatusesDto } from '../../../application-layer/drydock/specification-details/dtos/GetSpecificationStatusesDto';
import { GetSpecificationStatusesQuery } from '../../../application-layer/drydock/specification-details/GetSpecificationStatusesQuery';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

/**
 * @exports
 * @param {Request} req Express request
 * @param {Response} res Express response
 */
export async function getSpecificationStatuses(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async () => {
        const result = await new GetSpecificationStatusesController().getSpecificationStatuses();

        return result;
    });
}

exports.get = getSpecificationStatuses;

// @Route('drydock/specification-details/get-specifications-statuses')
export class GetSpecificationStatusesController extends Controller {
    @Get()
    public async getSpecificationStatuses(): Promise<GetSpecificationsStatusesDto[]> {
        const query = new GetSpecificationStatusesQuery();

        const result = await query.ExecuteAsync();

        return result;
    }
}
