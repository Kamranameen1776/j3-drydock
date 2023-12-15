import { Request, Response } from 'express';

import { UpdateStandardJobSubItemsCommand } from '../../../application-layer/drydock/standard-jobs';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function updateStandardJobsSubItems(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler('standard_jobs');

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const command = new UpdateStandardJobSubItemsCommand();

        return command.ExecuteAsync(request);
    });
}

exports.put = updateStandardJobsSubItems;
