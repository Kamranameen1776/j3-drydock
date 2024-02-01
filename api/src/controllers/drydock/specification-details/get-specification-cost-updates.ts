import { Request, Response } from 'express';
import { Body, Controller, Post } from 'tsoa';

import { GetSpecificationCostUpdatesQuery } from '../../../application-layer/drydock/specification-details/GetSpecificationCostUpdatesQuery';
import {
    SpecificationCostUpdateDto,
    SpecificationCostUpdateRequestDto,
} from '../../../dal/drydock/specification-details/dtos/ISpecificationCostUpdateDto';
import { ODataResult } from '../../../shared/interfaces';
import { FoldableGridData } from '../../../shared/interfaces/foldable-grid-data.interface';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

export async function getSpecificationCostUpdates(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const result = await new GetSpecificationCostUpdatesController().getSpecificationCostUpdates(request);

        return result;
    });
}

exports.post = getSpecificationCostUpdates;

// @Route('drydock/specification-details/get-specification-cost-updates')
export class GetSpecificationCostUpdatesController extends Controller {
    @Post()
    public async getSpecificationCostUpdates(
        @Body() request: Request,
    ): Promise<ODataResult<FoldableGridData<SpecificationCostUpdateDto>>> {
        const query = new GetSpecificationCostUpdatesQuery();

        const result = await query.ExecuteAsync(request, SpecificationCostUpdateRequestDto);

        return result;
    }
}
