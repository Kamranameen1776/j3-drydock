import * as express from 'express';
import { AccessRights } from 'j2utils';
import { Body, Controller, Post, Request, Route } from 'tsoa';

import { CreateSpecificationFromStandardJobsCommand } from '../../../application-layer/drydock/specification-details/CreateSpecificationFromStandardJobCommand';
import { CreateSpecificationFromStandardJobDto } from '../../../dal/drydock/specification-details/dtos/ICreateSpecificationFromStandardJobDto';
import { SpecificationDetailsEntity } from '../../../entity/drydock';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function createSpecificationFromStandardJobs(req: express.Request, res: express.Response) {
    const middlewareHandler = new MiddlewareHandler('standard_jobs');

    await middlewareHandler.ExecuteAsync(req, res, async (request: express.Request) => {
        return new CreateSpecificationFromStandardJobsController().createSpecificationFromStandardJobs(
            request.body,
            request,
        );
    });
}

exports.post = createSpecificationFromStandardJobs;

@Route('drydock/specification-details/create-specification-from-standard-job')
export class CreateSpecificationFromStandardJobsController extends Controller {
    @Post()
    public async createSpecificationFromStandardJobs(
        @Body() dto: CreateSpecificationFromStandardJobDto,
        @Request() request: express.Request,
    ): Promise<SpecificationDetailsEntity[]> {
        const { UserUID: createdBy } = AccessRights.authorizationDecode(request);

        dto.createdBy = createdBy;
        dto.token = request.headers.authorization as string;

        const query = new CreateSpecificationFromStandardJobsCommand();

        return query.ExecuteAsync(dto);
    }
}
