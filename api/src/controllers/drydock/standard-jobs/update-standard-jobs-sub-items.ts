import * as express from 'express';
import { AccessRights } from 'j2utils';
import { Body, Controller, Put, Request, Route } from 'tsoa';

import { UpdateStandardJobSubItemsCommand } from '../../../application-layer/drydock/standard-jobs';
import { UpdateStandardJobSubItemsRequestDto } from '../../../application-layer/drydock/standard-jobs/dto';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function updateStandardJobsSubItems(req: express.Request, res: express.Response) {
    const middlewareHandler = new MiddlewareHandler('standard_jobs');

    await middlewareHandler.ExecuteAsync(req, res, async (request: express.Request) => {
        const result = await new UpdateStandardJobsSubItemsController().updateStandardJobsSubItems(
            request.body,
            request,
        );

        return result;
    });
}

exports.put = updateStandardJobsSubItems;

@Route('drydock/standard-jobs/update-standard-jobs-sub-items')
export class UpdateStandardJobsSubItemsController extends Controller {
    @Put()
    public async updateStandardJobsSubItems(
        @Body() dto: UpdateStandardJobSubItemsRequestDto,
        @Request() request: express.Request,
    ): Promise<void> {
        const { UserUID: userUID } = AccessRights.authorizationDecode(request);
        dto.UserUID = userUID;

        const query = new UpdateStandardJobSubItemsCommand();

        await query.ExecuteAsync(dto);
    }
}
