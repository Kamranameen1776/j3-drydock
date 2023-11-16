import { Request, Response } from 'express';

import { GetStandardJobsFiltersCommand } from '../../../application-layer/drydock/standard-jobs';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function getStandardJobsFilters(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler('standard_jobs');

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const command = new GetStandardJobsFiltersCommand();

        return command.ExecuteAsync(request);
    });
}

exports.post = getStandardJobsFilters;
