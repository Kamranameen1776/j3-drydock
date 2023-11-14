import { Request, Response } from 'express';

import { DeleteStandardJobsCommand } from '../../../application-layer/drydock/standard-jobs';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function deleteStandardJobs(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler('standard_jobs');

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const command = new DeleteStandardJobsCommand();

        return await command.ExecuteAsync(request);
    });
}

exports.put = deleteStandardJobs;
