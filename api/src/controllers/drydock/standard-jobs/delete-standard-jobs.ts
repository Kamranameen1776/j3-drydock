import { Request, Response } from 'express';
import { Body, Controller, Put } from 'tsoa';
import { UpdateResult } from 'typeorm';

import { DeleteStandardJobsCommand } from '../../../application-layer/drydock/standard-jobs';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function deleteStandardJobs(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler('standard_jobs');

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const result = await new DeleteStandardJobsController().createStandardJobs(request);

        return result;
    });
}

exports.put = deleteStandardJobs;

// @Route('drydock/standard-jobs/delete-standard-jobs')
export class DeleteStandardJobsController extends Controller {
    @Put()
    public async createStandardJobs(@Body() request: Request): Promise<UpdateResult> {
        const query = new DeleteStandardJobsCommand();

        const result = await query.ExecuteAsync(request);

        return result;
    }
}
