import * as express from 'express';
import { AccessRights } from 'j2utils';
import { Body, Controller, Put, Request, Route } from 'tsoa';

import { UserFromToken } from '../../../application-layer/drydock/core/cqrs/UserDto';
import { DeleteSpecificationDetailsCommand } from '../../../application-layer/drydock/specification-details/DeleteSpecificationDetailsCommand';
import { DeleteSpecificationDetailsDto } from '../../../application-layer/drydock/specification-details/dtos/DeleteSpecificationDetailsDto';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function deleteSpecificationDetails(req: express.Request, res: express.Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: express.Request) => {
        const result = await new DeleteSpecificationDetailsController().deleteSpecificationDetails(
            request.body,
            request,
        );

        return result;
    });
}

exports.put = deleteSpecificationDetails;

// @Route('drydock/specification-details/delete-specification-details')
export class DeleteSpecificationDetailsController extends Controller {
    @Put()
    public async deleteSpecificationDetails(
        @Body() dto: DeleteSpecificationDetailsDto,
        @Request() request: express.Request,
    ): Promise<void> {
        const user = AccessRights.authorizationDecode(request) as UserFromToken;

        dto.uid = request.body.uid;
        dto.UserId = user.UserID;
        dto.token = request.headers.authorization as string;

        const query = new DeleteSpecificationDetailsCommand();

        const result = await query.ExecuteAsync(dto);

        return result;
    }
}
