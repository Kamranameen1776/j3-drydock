import * as express from 'express';
import { AccessRights } from 'j2utils';
import { Body, Controller, Post, Request, Route } from 'tsoa';

import { UserFromToken } from '../../../application-layer/drydock/core/cqrs/UserDto';
import { CreateStandardJobsCommand } from '../../../application-layer/drydock/standard-jobs';
import { CreateStandardJobsRequestDto } from '../../../application-layer/drydock/standard-jobs/dto';
import { StandardJobs } from '../../../entity/drydock';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function createStandardJobs(req: express.Request, res: express.Response) {
    const middlewareHandler = new MiddlewareHandler('standard_jobs');

    await middlewareHandler.ExecuteAsync(req, res, async (request: express.Request) => {
        const result = await new CreateStandardJobsController().createStandardJobs(request.body, request);

        return result;
    });
}

exports.post = createStandardJobs;

@Route('drydock/standard-jobs/create-standard-jobs')
export class CreateStandardJobsController extends Controller {
    @Post()
    public async createStandardJobs(
        // TODO: check if newer version of tsoa supports this
        // @Body() dto: CreateStandardJobsRequestDto,
        @Body() dto: any,
        @Request() request: express.Request,
    ): Promise<StandardJobs> {
        const query = new CreateStandardJobsCommand();

        const authUser = AccessRights.authorizationDecode(request) as UserFromToken;

        dto.UserId = authUser.UserID;

        const result = await query.ExecuteAsync(dto);

        return result;
    }
}
