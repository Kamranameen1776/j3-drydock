import * as express from 'express';
import { Controller, Get, Query, Request, Route } from 'tsoa';

import { GetAsyncJobQuery } from '../../application-layer/drydock/GetAsyncJobQuery';
import { MiddlewareHandler } from '../../controllers/drydock/core/middleware/MiddlewareHandler';
import { AsyncJobsEntity } from '../../entity/drydock/AsyncJobsEntity';

@Route('drydock/get-async-job')
export class GetAsyncJobController extends Controller {
    @Get()
    public async getAsyncJob(
        @Request() request: express.Request,
        @Query() uid: string,
    ): Promise<AsyncJobsEntity | undefined> {
        const query = new GetAsyncJobQuery();

        return query.ExecuteAsync(uid);
    }
}

exports.get = new MiddlewareHandler().ExecuteHandlerAsync(async (request: express.Request) => {
    return new GetAsyncJobController().getAsyncJob(request, request.query.uid as string);
});
