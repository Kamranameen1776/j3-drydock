import { Request, Response } from 'express';

import { UpdateStandardJobsCommand } from '../../../application-layer/drydock/standard-jobs';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function updateStandardJobs(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler('standard_jobs');

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const command = new UpdateStandardJobsCommand();

        return command.ExecuteAsync(request);
    });
}

exports.put = updateStandardJobs;
