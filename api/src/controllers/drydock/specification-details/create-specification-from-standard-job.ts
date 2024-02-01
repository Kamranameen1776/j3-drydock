import { Request, Response } from 'express';
import { Body, Controller, Post } from 'tsoa';

import { CreateSpecificationFromStandardJobsCommand } from '../../../application-layer/drydock/specification-details/CreateSpecificationFromStandardJobCommand';
import { CreateSpecificationFromStandardJobDto } from '../../../dal/drydock/specification-details/dtos/ICreateSpecificationFromStandardJobDto';
import { SpecificationDetailsEntity } from '../../../entity/drydock';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function createSpecificationFromStandardJobs(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler('standard_jobs');

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const result = await new CreateSpecificationFromStandardJobsController().createSpecificationFromStandardJobs(
            request,
        );

        return result;
    });
}

exports.post = createSpecificationFromStandardJobs;

// @Route('drydock/specification-details/create-specification-from-standard-job')
export class CreateSpecificationFromStandardJobsController extends Controller {
    @Post()
    public async createSpecificationFromStandardJobs(@Body() request: Request): Promise<SpecificationDetailsEntity[]> {
        const query = new CreateSpecificationFromStandardJobsCommand();

        const result = await query.ExecuteAsync(request, CreateSpecificationFromStandardJobDto, 'body');

        return result;
    }
}
