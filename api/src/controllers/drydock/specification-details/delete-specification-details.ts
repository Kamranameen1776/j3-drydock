import { Request, Response } from 'express';
import { Body, Controller, Put } from 'tsoa';

import { CommandRequest } from '../../../application-layer/drydock/core/cqrs/CommandRequestDto';
import { UserFromToken } from '../../../application-layer/drydock/core/cqrs/UserDto';
import { DeleteSpecificationDetailsCommand } from '../../../application-layer/drydock/specification-details/DeleteSpecificationDetailsCommand';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function deleteSpecificationDetails(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request, _, user: UserFromToken) => {
        const result = await new DeleteSpecificationDetailsController().deleteSpecificationDetails({
            request,
            user,
        });

        return result;
    });
}

exports.put = deleteSpecificationDetails;

// @Route('drydock/specification-details/delete-specification-details')
export class DeleteSpecificationDetailsController extends Controller {
    @Put()
    public async deleteSpecificationDetails(@Body() request: CommandRequest): Promise<void> {
        const query = new DeleteSpecificationDetailsCommand();

        const result = await query.ExecuteAsync(request);

        return result;
    }
}
