import { Request, Response } from 'express';
import { Body, Controller, Get } from 'tsoa';

import { GetSpecificationByUidDto } from '../../../application-layer/drydock/specification-details/dtos/GetSpecificationByUidDto';
import { GetSpecificationDetailsDto } from '../../../application-layer/drydock/specification-details/dtos/GetSpecificationDetailsDto';
import { GetSpecificationDetailsQuery } from '../../../application-layer/drydock/specification-details/GetSpecificationDetailsQuery';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

/**
 * @exports
 * @param {Request} req Express request
 * @param {Response} res Express response
 */
export async function getSpecificationDetails(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const result = await new GetSpecificationDetailsController().getSpecificationDetails(request);

        return result;
    });
}

exports.get = getSpecificationDetails;

// @Route('drydock/specification-details/get-specification-details')
export class GetSpecificationDetailsController extends Controller {
    @Get()
    public async getSpecificationDetails(@Body() request: Request): Promise<GetSpecificationDetailsDto> {
        const query = new GetSpecificationDetailsQuery();

        const result = await query.ExecuteAsync(request, GetSpecificationByUidDto, 'query');

        return result;
    }
}
