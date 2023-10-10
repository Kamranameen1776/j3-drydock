import { Request, Response } from 'express';

import { GetStandardJobsCommand } from '../../../application-layer/drydock/standard-jobs/GetStandardJobsCommand';
import { RequestWithOData } from '../../../shared/interfaces/request-with-odata.interface';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function getStandardJobs(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const command = new GetStandardJobsCommand();

        return await command.ExecuteAsync(request as RequestWithOData);
    });
}

exports.post = getStandardJobs;
