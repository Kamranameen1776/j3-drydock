import { Request, Response } from 'express';

import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';
import {
    GetStandardJobsFiltersCommand
} from "../../../application-layer/drydock/standard-jobs";

async function getStandardJobsFilters(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const command = new GetStandardJobsFiltersCommand();

        return await command.ExecuteAsync(request);
    });
}

exports.post = getStandardJobsFilters;
