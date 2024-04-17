import * as express from 'express';
import { Controller, Get, Query, Request, Route } from 'tsoa';

import { GetSpecificationByUidDto } from '../../../application-layer/drydock/specification-details/dtos/GetSpecificationByUidDto';
import { GetSpecificationDetailsDto } from '../../../application-layer/drydock/specification-details/dtos/GetSpecificationDetailsDto';
import { GetSpecificationDetailsQuery } from '../../../application-layer/drydock/specification-details/GetSpecificationDetailsQuery';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

/**
 * @exports
 * @param {Request} req Express request
 * @param {Response} res Express response
 */
export async function getSpecificationDetails(req: express.Request, res: express.Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: express.Request) => {
        return new GetSpecificationDetailsController().getSpecificationDetails(request.query.uid as string, request);
    });
}

exports.get = getSpecificationDetails;

@Route('drydock/specification-details/get-specification-details')
export class GetSpecificationDetailsController extends Controller {
    @Get()
    public async getSpecificationDetails(
        @Query() uid: string,
        @Request() request: express.Request,
    ): Promise<GetSpecificationDetailsDto> {
        const query = new GetSpecificationDetailsQuery();

        const dto = new GetSpecificationByUidDto();
        dto.uid = uid;
        dto.token = request.headers.authorization as string;

        return query.ExecuteAsync(dto);
    }
}
