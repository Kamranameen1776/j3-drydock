import { Request, Response } from 'express';
import { Body, Controller, Put } from 'tsoa';

import { CommandRequest } from '../../../application-layer/drydock/core/cqrs/CommandRequestDto';
import { UserFromToken } from '../../../application-layer/drydock/core/cqrs/UserDto';
import { UpdateSpecificationDetailsCommand } from '../../../application-layer/drydock/specification-details/UpdateSpecificationDetailsCommand';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function updateSpecificationDetails(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request, _, user: UserFromToken) => {
        const result = await new UpdateSpecificationDetailsController().updateSpecificationDetails({
            request,
            user,
        });

        return result;
    });
}

exports.put = updateSpecificationDetails;

// @Route('drydock/specification-details/update-specification-details')
export class UpdateSpecificationDetailsController extends Controller {
    @Put()
    public async updateSpecificationDetails(@Body() request: CommandRequest): Promise<void> {
        const query = new UpdateSpecificationDetailsCommand();

        const result = await query.ExecuteAsync(request);

        return result;
    }
}
