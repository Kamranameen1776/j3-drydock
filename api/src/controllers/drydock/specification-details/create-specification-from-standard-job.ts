import { Request, Response } from 'express';

import { CreateSpecificationFromStandardJobsCommand } from '../../../application-layer/drydock/specification-details/CreateStandardJobsFromSpecificationsCommand';
import { CreateSpecificationFromStandardJobDto } from '../../../dal/drydock/specification-details/dtos/ICreateSpecificationFromStandardJobDto';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function createSpecificationFromStandardJobs(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler('standard_jobs');

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const command = new CreateSpecificationFromStandardJobsCommand();

        return command.ExecuteAsync(request, CreateSpecificationFromStandardJobDto);
    });
}

exports.post = createSpecificationFromStandardJobs;
