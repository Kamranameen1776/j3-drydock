import { Request, Response } from 'express';

import { GetSpecificationCostUpdatesQuery } from '../../../application-layer/drydock/specification-details/GetSpecificationCostUpdatesQuery';
import { SpecificationCostUpdateRequestDto } from '../../../dal/drydock/specification-details/dtos/ISpecificationCostUpdateDto';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

export async function getSpecificationCostUpdates(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (queryDto: Request) => {
        const query = new GetSpecificationCostUpdatesQuery();

        return query.ExecuteAsync(queryDto as Request, SpecificationCostUpdateRequestDto);
    });
}

exports.post = getSpecificationCostUpdates;
