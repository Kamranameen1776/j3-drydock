import { Request, Response } from 'express';
import { Body, Controller, Post } from 'tsoa';

import { GetManySpecificationDetailsQuery } from '../../../application-layer/drydock/specification-details/GetManySpecificationDetailsQuery';
import { SpecificationDetailsEntity } from '../../../entity/drydock';
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

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const result = await new GetManySpecificationDetailsController().getManySpecificationDetails(request);

        return result;
    });
}

exports.post = getManySpecificationDetails;

// @Route('drydock/specification-details/get-many-specification-details')
export class GetManySpecificationDetailsController extends Controller {
    @Post()
    public async getManySpecificationDetails(
        @Body() request: Request,
    ): Promise<{ records: SpecificationDetailsEntity[]; count?: number }> {
        const query = new GetManySpecificationDetailsQuery();

        const result = await query.ExecuteAsync(request);

        return result;
    }
}
