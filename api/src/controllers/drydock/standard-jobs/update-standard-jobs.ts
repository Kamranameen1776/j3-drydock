import * as express from 'express';
import { AccessRights } from 'j2utils';
import { Body, Controller, Put, Request, Route } from 'tsoa';

import { UpdateStandardJobsCommand } from '../../../application-layer/drydock/standard-jobs';
import { StandardJobs } from '../../../entity/drydock';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function updateStandardJobs(req: express.Request, res: express.Response) {
    const middlewareHandler = new MiddlewareHandler('standard_jobs');

    await middlewareHandler.ExecuteAsync(req, res, async (request: express.Request) => {
        const result = await new UpdateStandardJobsController().updateStandardJobs(request.body, request);

        return result;
    });
}

exports.put = updateStandardJobs;

@Route('drydock/standard-jobs/update-standard-jobs')
export class UpdateStandardJobsController extends Controller {
    @Put()
    public async updateStandardJobs(
        // TODO: check if new version of tsoa supports this
        // @Body() dto: UpdateStandardJobsRequestDto,
        @Body() dto: any,
        @Request() request: express.Request,
    ): Promise<StandardJobs> {
        const query = new UpdateStandardJobsCommand();

        const { UserUID: userUID } = AccessRights.authorizationDecode(request);
        dto.UserId = userUID;

        const result = await query.ExecuteAsync(dto);

        return result;
    }
}
