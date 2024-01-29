import { Request, Response } from 'express';
import { Body, Controller, Post } from 'tsoa';

import { CreateStandardJobsCommand } from '../../../application-layer/drydock/standard-jobs';
import { StandardJobs } from '../../../entity/drydock';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function createStandardJobs(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler('standard_jobs');

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const result = await new CreateStandardJobsController().createStandardJobs(request);

        return result;
    });
}

exports.post = createStandardJobs;

// @Route('drydock/standard-jobs/create-standard-jobs')
export class CreateStandardJobsController extends Controller {
    @Post()
    public async createStandardJobs(@Body() request: Request): Promise<StandardJobs> {
        const query = new CreateStandardJobsCommand();

        const result = await query.ExecuteAsync(request);

        return result;
    }
}
