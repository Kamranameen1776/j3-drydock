import { Response } from 'express';
import { Body, Controller, Put } from 'tsoa';

import { UpdateSubItemUtilizedCommand } from '../../../../application-layer/drydock/specification-details/sub-items/UpdateSubItemUtilizedCommand';
import { Req } from '../../../../common/drydock/ts-helpers/req-res';
import { UpdateSubItemUtilizedDto } from '../../../../dal/drydock/specification-details/sub-items/dto/UpdateSubItemUtilizedDto';
import { MiddlewareHandler } from '../../core/middleware/MiddlewareHandler';

async function updateSubItemUtilized(req: Req<UpdateSubItemUtilizedDto>, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async () => {
        const result = await new UpdateSubItemUtilizedController().updateSubItemUtilized(req);

        return result;
    });
}

exports.put = updateSubItemUtilized;

// @Route('drydock/specification-details/sub-items/update-sub-item-utilized')
export class UpdateSubItemUtilizedController extends Controller {
    @Put()
    public async updateSubItemUtilized(@Body() request: Req<UpdateSubItemUtilizedDto>): Promise<void> {
        const query = new UpdateSubItemUtilizedCommand();

        const result = await query.ExecuteAsync(request, UpdateSubItemUtilizedDto);

        return result;
    }
}
