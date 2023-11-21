import { Request, Response } from 'express';

import { CreateStandardJobsCommand } from '../../../application-layer/drydock/standard-jobs';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function createStandardJobs(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler('standard_jobs');

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const command = new CreateStandardJobsCommand();

        return command.ExecuteAsync(request);
    });
}

exports.post = createStandardJobs;
