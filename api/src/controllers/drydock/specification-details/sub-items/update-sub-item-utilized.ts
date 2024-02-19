import * as express from 'express';
import { AccessRights } from 'j2utils';
import { Body, Controller, Put, Request, Route } from 'tsoa';

import { UserFromToken } from '../../../../application-layer/drydock/core/cqrs/UserDto';
import { UpdateSubItemUtilizedCommand } from '../../../../application-layer/drydock/specification-details/sub-items/UpdateSubItemUtilizedCommand';
import { UpdateSubItemUtilizedDto } from '../../../../dal/drydock/specification-details/sub-items/dto/UpdateSubItemUtilizedDto';
import { MiddlewareHandler } from '../../core/middleware/MiddlewareHandler';

async function updateSubItemUtilized(req: express.Request, res: express.Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async () => {
        const result = await new UpdateSubItemUtilizedController().updateSubItemUtilized(req.body, req);

        return result;
    });
}

exports.put = updateSubItemUtilized;

@Route('drydock/specification-details/sub-items/update-sub-item-utilized')
export class UpdateSubItemUtilizedController extends Controller {
    @Put()
    public async updateSubItemUtilized(
        @Body() dto: UpdateSubItemUtilizedDto,
        @Request() request: express.Request,
    ): Promise<void> {
        const authUser = AccessRights.authorizationDecode(request) as UserFromToken;
        dto.userUid = authUser.UserUID;

        const query = new UpdateSubItemUtilizedCommand();

        const result = await query.ExecuteAsync(dto);

        return result;
    }
}
