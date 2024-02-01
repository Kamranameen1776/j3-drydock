import * as express from 'express';
import { AccessRights } from 'j2utils';
import { Controller, Put, Query, Request, Route } from 'tsoa';
import { UpdateResult } from 'typeorm';

import { UserFromToken } from '../../../application-layer/drydock/core/cqrs/UserDto';
import { DeleteStandardJobsCommand } from '../../../application-layer/drydock/standard-jobs';
import { DeleteStandardJobsRequestDto } from '../../../application-layer/drydock/standard-jobs/dto';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function deleteStandardJobs(req: express.Request, res: express.Response) {
    const middlewareHandler = new MiddlewareHandler('standard_jobs');

    await middlewareHandler.ExecuteAsync(req, res, async (request: express.Request) => {
        const result = await new DeleteStandardJobsController().createStandardJobs(
            request.query.uid as string,
            request,
        );

        return result;
    });
}

exports.put = deleteStandardJobs;

@Route('drydock/standard-jobs/delete-standard-jobs')
export class DeleteStandardJobsController extends Controller {
    @Put()
    public async createStandardJobs(@Query() uid: string, @Request() request: express.Request): Promise<UpdateResult> {
        const authUser = AccessRights.authorizationDecode(request) as UserFromToken;

        const dto: DeleteStandardJobsRequestDto = {
            uid: uid,
            UserId: authUser.UserID,
        };

        const query = new DeleteStandardJobsCommand();

        const result = await query.ExecuteAsync(dto);

        return result;
    }
}
