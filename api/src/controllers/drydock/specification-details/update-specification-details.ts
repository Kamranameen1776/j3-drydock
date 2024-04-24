import * as express from 'express';
import { AccessRights } from 'j2utils';
import { Body, Controller, Put, Request, Route } from 'tsoa';

import { UserFromToken } from '../../../application-layer/drydock/core/cqrs/UserDto';
import { UpdateSpecificationDetailsDto } from '../../../application-layer/drydock/specification-details/dtos/UpdateSpecificationDetailsDto';
import { UpdateSpecificationDetailsCommand } from '../../../application-layer/drydock/specification-details/UpdateSpecificationDetailsCommand';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function updateSpecificationDetails(req: express.Request, res: express.Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: express.Request) => {
        return new UpdateSpecificationDetailsController().updateSpecificationDetails(request.body, request);
    });
}

exports.put = updateSpecificationDetails;

@Route('drydock/specification-details/update-specification-details')
export class UpdateSpecificationDetailsController extends Controller {
    @Put()
    public async updateSpecificationDetails(
        @Body() dto: UpdateSpecificationDetailsDto,
        @Request() request: express.Request,
    ): Promise<void> {
        const query = new UpdateSpecificationDetailsCommand();

        const authUser = AccessRights.authorizationDecode(request) as UserFromToken;

        dto.UserId = authUser.UserID;

        return query.ExecuteAsync(dto);
    }
}
