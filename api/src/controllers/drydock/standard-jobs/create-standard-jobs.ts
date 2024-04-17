import * as express from 'express';
import { AccessRights } from 'j2utils';
import { Body, Controller, Post, Request, Route } from 'tsoa';

import { CreateStandardJobsCommand } from '../../../application-layer/drydock/standard-jobs';
import { CreateStandardJobsRequestDto } from '../../../application-layer/drydock/standard-jobs/dto';
import { StandardJobs } from '../../../entity/drydock';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function createStandardJobs(req: express.Request, res: express.Response) {
    const middlewareHandler = new MiddlewareHandler('standard_jobs');

    await middlewareHandler.ExecuteAsync(req, res, async (request: express.Request) => {
        return new CreateStandardJobsController().createStandardJobs(request.body, request);
    });
}

exports.post = createStandardJobs;

@Route('drydock/standard-jobs/create-standard-jobs')
export class CreateStandardJobsController extends Controller {
    @Post()
    public async createStandardJobs(
        @Body() dto: CreateStandardJobsRequestDto,
        @Request() request: express.Request,
    ): Promise<StandardJobs> {
        const query = new CreateStandardJobsCommand();

        const { UserUID: id } = AccessRights.authorizationDecode(request);

        dto.UserId = id;

        return query.ExecuteAsync(dto);
    }
}
