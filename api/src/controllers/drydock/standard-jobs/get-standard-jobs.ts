import { Request, Response } from 'express';
import { Body, Controller, Post } from 'tsoa';

import { GetStandardJobsCommand } from '../../../application-layer/drydock/standard-jobs';
import { GetStandardJobsResultDto } from '../../../application-layer/drydock/standard-jobs/dto';
import { RequestWithOData } from '../../../shared/interfaces';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function getStandardJobs(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler('standard_jobs');

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const result = await new GetStandardJobsController().getStandardJobs(request as RequestWithOData);

        return result;
    });
}

exports.post = getStandardJobs;

// @Route('drydock/standard-jobs/get-standard-jobs')
export class GetStandardJobsController extends Controller {
    @Post()
    public async getStandardJobs(@Body() request: RequestWithOData): Promise<GetStandardJobsResultDto> {
        const query = new GetStandardJobsCommand();

        const result = await query.ExecuteAsync(request);

        return result;
    }
}
