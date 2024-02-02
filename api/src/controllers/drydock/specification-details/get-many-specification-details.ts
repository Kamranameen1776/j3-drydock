import * as express from 'express';
import { Body, Controller, Post, Request, Route } from 'tsoa';

import { GridRequestBody } from '../../../application-layer/drydock/core/cqrs/jbGrid/GridRequestBody';
import { GetManySpecificationDetailsQuery } from '../../../application-layer/drydock/specification-details/GetManySpecificationDetailsQuery';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';
import { Req } from '../../../common/drydock/ts-helpers/req-res';

export async function getManySpecificationDetails(req: express.Request, res: express.Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: express.Request) => {
        const result = await new GetManySpecificationDetailsController().getManySpecificationDetails(
            request.body,
            request,
        );

        return result;
    });
}

exports.post = getManySpecificationDetails;

@Route('drydock/specification-details/get-many-specification-details')
export class GetManySpecificationDetailsController extends Controller {
    @Post()
    public async getManySpecificationDetails(
        @Body() body: GridRequestBody,
        @Request() request: Req<GridRequestBody>,

        // TODO: check if newer version of tsoa supports this
        //
        // ): Promise<{ records: SpecificationDetailsEntity[]; count?: number }> {
    ): Promise<{ records: unknown; count?: number }> {
        const query = new GetManySpecificationDetailsQuery();

        const result = await query.ExecuteAsync(request);

        return result;
    }
}
