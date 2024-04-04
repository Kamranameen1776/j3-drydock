import * as express from 'express';
import { Body, Controller, Post, Request, Route } from 'tsoa';

import { GetSpecificationCostUpdatesQuery } from '../../../application-layer/drydock/specification-details/GetSpecificationCostUpdatesQuery';
import { Req } from '../../../common/drydock/ts-helpers/req-res';
import {
    SpecificationCostUpdateDto,
    SpecificationCostUpdateRequestDto,
} from '../../../dal/drydock/specification-details/dtos/ISpecificationCostUpdateDto';
import { ODataResult } from '../../../shared/interfaces';
import { FoldableGridData } from '../../../shared/interfaces/foldable-grid-data.interface';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

export async function getSpecificationCostUpdates(req: express.Request, res: express.Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: express.Request) => {
        return new GetSpecificationCostUpdatesController().getSpecificationCostUpdates(request.body, request);
    });
}

exports.post = getSpecificationCostUpdates;

@Route('drydock/specification-details/get-specification-cost-updates')
export class GetSpecificationCostUpdatesController extends Controller {
    @Post()
    public async getSpecificationCostUpdates(
        @Body() dto: SpecificationCostUpdateRequestDto,
        @Request() request: Req<SpecificationCostUpdateRequestDto>,
    ): Promise<ODataResult<FoldableGridData<SpecificationCostUpdateDto>>> {
        const query = new GetSpecificationCostUpdatesQuery();

        return query.ExecuteAsync(request, SpecificationCostUpdateRequestDto);
    }
}
