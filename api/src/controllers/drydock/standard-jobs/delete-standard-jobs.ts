import * as express from 'express';
import { AccessRights } from 'j2utils';
import { Body, Controller, Put, Request, Route } from 'tsoa';
import { UpdateResult } from 'typeorm';

import { UserFromToken } from '../../../application-layer/drydock/core/cqrs/UserDto';
import { DeleteStandardJobsCommand } from '../../../application-layer/drydock/standard-jobs';
import { DeleteStandardJobsRequestDto } from '../../../application-layer/drydock/standard-jobs/dto';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

@Route('drydock/standard-jobs/delete-standard-jobs')
export class DeleteStandardJobsController extends Controller {
    @Put()
    public async deleteStandardJobs(
        @Body() body: { uid: string },
        @Request() request: express.Request,
    ): Promise<UpdateResult> {
        const authUser = AccessRights.authorizationDecode(request) as UserFromToken;

        const dto: DeleteStandardJobsRequestDto = {
            uid: body.uid,
            UserId: authUser.UserUID,
        };

        const query = new DeleteStandardJobsCommand();

        const result = await query.ExecuteAsync(dto);

        return result;
    }
}

exports.put = new MiddlewareHandler().ExecuteHandlerAsync(async (request: express.Request) => {
    return new DeleteStandardJobsController().deleteStandardJobs(request.body, request);
});
