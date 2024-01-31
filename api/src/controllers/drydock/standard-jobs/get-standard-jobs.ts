import * as express from 'express';
import { Controller, Post, Request, Route } from 'tsoa';

import { GetStandardJobsCommand } from '../../../application-layer/drydock/standard-jobs';
import { RequestWithOData } from '../../../shared/interfaces';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function getStandardJobs(req: express.Request, res: express.Response) {
    const middlewareHandler = new MiddlewareHandler('standard_jobs');

    await middlewareHandler.ExecuteAsync(req, res, async (request: express.Request) => {
        const result = await new GetStandardJobsController().getStandardJobs(request as RequestWithOData);

        return result;
    });
}

exports.post = getStandardJobs;

@Route('drydock/standard-jobs/get-standard-jobs')
export class GetStandardJobsController extends Controller {
    // TODO: specify @Body() strongly typed DTO
    @Post()
    // TODO: re-check if newer version of `tsoa` can handle `GetStandardJobsResultDto` as return type
    //public async getStandardJobs(@Request() request: RequestWithOData): Promise<GetStandardJobsResultDto> {
    public async getStandardJobs(@Request() request: RequestWithOData): Promise<unknown> {
        const query = new GetStandardJobsCommand();

        const result = await query.ExecuteAsync(request);

        return result;
    }
}
