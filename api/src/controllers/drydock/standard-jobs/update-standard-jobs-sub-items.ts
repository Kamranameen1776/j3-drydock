import { Request, Response } from 'express';
import { Body, Controller, Put } from 'tsoa';

import { UpdateStandardJobSubItemsCommand } from '../../../application-layer/drydock/standard-jobs';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function updateStandardJobsSubItems(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler('standard_jobs');

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const result = await new UpdateStandardJobsSubItemsController().updateStandardJobsSubItems(request);

        return result;
    });
}

exports.put = updateStandardJobsSubItems;

// @Route('drydock/standard-jobs/update-standard-jobs-sub-items')
export class UpdateStandardJobsSubItemsController extends Controller {
    @Put()
    public async updateStandardJobsSubItems(@Body() request: Request): Promise<void> {
        const query = new UpdateStandardJobSubItemsCommand();

        const result = await query.ExecuteAsync(request);

        return result;
    }
}
