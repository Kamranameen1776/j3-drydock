import { Request, Response } from 'express';
import { Body, Controller, Put } from 'tsoa';

import { UpdateStandardJobsCommand } from '../../../application-layer/drydock/standard-jobs';
import { StandardJobs } from '../../../entity/drydock';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function updateStandardJobs(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler('standard_jobs');

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const result = await new UpdateStandardJobsController().updateStandardJobs(request);

        return result;
    });
}

exports.put = updateStandardJobs;

// @Route('drydock/standard-jobs/update-standard-jobs')
export class UpdateStandardJobsController extends Controller {
    @Put()
    public async updateStandardJobs(@Body() request: Request): Promise<StandardJobs> {
        const query = new UpdateStandardJobsCommand();

        const result = await query.ExecuteAsync(request);

        return result;
    }
}
