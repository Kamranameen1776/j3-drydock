import { Request, Response } from 'express';
import { Body, Controller, Post } from 'tsoa';

import { GetStandardJobsFiltersCommand } from '../../../application-layer/drydock/standard-jobs';
import { FiltersDataResponse } from '../../../shared/interfaces';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function getStandardJobsFilters(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler('standard_jobs');

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const result = await new GetStandardJobsFiltersController().getStandardJobsFilters(request);

        return result;
    });
}

exports.post = getStandardJobsFilters;

// @Route('drydock/standard-jobs/get-standard-jobs-filters')
export class GetStandardJobsFiltersController extends Controller {
    @Post()
    public async getStandardJobsFilters(@Body() request: Request): Promise<FiltersDataResponse[]> {
        const query = new GetStandardJobsFiltersCommand();

        const result = await query.ExecuteAsync(request);

        return result;
    }
}
