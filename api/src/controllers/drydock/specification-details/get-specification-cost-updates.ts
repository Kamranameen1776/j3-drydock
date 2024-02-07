import * as express from 'express';
import { Body, Controller, Post, Request, Route } from 'tsoa';

import { GetSpecificationCostUpdatesQuery } from '../../../application-layer/drydock/specification-details/GetSpecificationCostUpdatesQuery';
import { Req } from '../../../common/drydock/ts-helpers/req-res';
import { SpecificationCostUpdateRequestDto } from '../../../dal/drydock/specification-details/dtos/ISpecificationCostUpdateDto';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

export async function getSpecificationCostUpdates(req: express.Request, res: express.Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: express.Request) => {
        const result = await new GetSpecificationCostUpdatesController().getSpecificationCostUpdates(
            request.body,
            request,
        );

        return result;
    });
}

exports.post = getSpecificationCostUpdates;

@Route('drydock/specification-details/get-specification-cost-updates')
export class GetSpecificationCostUpdatesController extends Controller {
    @Post()
    public async getSpecificationCostUpdates(
        @Body() dto: SpecificationCostUpdateRequestDto,
        @Request() request: Req<SpecificationCostUpdateRequestDto>,

        // TODO: check if newer version of tsoa supports this
        // ): Promise<ODataResult<FoldableGridData<SpecificationCostUpdateDto>>> {
    ): Promise<unknown> {
        const query = new GetSpecificationCostUpdatesQuery();

        const result = await query.ExecuteAsync(request, SpecificationCostUpdateRequestDto);

        return result;
    }
}
