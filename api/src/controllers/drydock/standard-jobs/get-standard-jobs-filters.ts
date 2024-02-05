import * as express from 'express';
import { Body, Controller, Post, Request, Route } from 'tsoa';

import { GetStandardJobsFiltersCommand } from '../../../application-layer/drydock/standard-jobs';
import { StandardJobsFiltersAllowedKeysRequestDto } from '../../../application-layer/drydock/standard-jobs/dto';
import { FiltersDataResponse } from '../../../shared/interfaces';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function getStandardJobsFilters(req: express.Request, res: express.Response) {
    const middlewareHandler = new MiddlewareHandler('standard_jobs');

    await middlewareHandler.ExecuteAsync(req, res, async (request: express.Request) => {
        const result = await new GetStandardJobsFiltersController().getStandardJobsFilters(request.body, request);

        return result;
    });
}

exports.post = getStandardJobsFilters;

// @Route('drydock/standard-jobs/get-standard-jobs-filters')
export class GetStandardJobsFiltersController extends Controller {
    @Post()
    public async getStandardJobsFilters(
        @Body() dto: StandardJobsFiltersAllowedKeysRequestDto,
        @Request() request: express.Request,
    ): Promise<FiltersDataResponse[]> {
        dto.token = request.headers.authorization as string;

        const query = new GetStandardJobsFiltersCommand();

        const result = await query.ExecuteAsync(dto);

        return result;
    }
}
