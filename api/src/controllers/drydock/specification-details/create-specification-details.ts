import * as express from 'express';
import { Controller, Post, Request, Route } from 'tsoa';

import { CommandRequest } from '../../../application-layer/drydock/core/cqrs/CommandRequestDto';
import { UserFromToken } from '../../../application-layer/drydock/core/cqrs/UserDto';
import { CreateSpecificationDetailsCommand } from '../../../application-layer/drydock/specification-details/CreateSpecificationDetailsCommand';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function CreateSpecificationDetails(req: express.Request, res: express.Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: express.Request, _, user: UserFromToken) => {
        const result = await new CreateSpecificationDetailsController().CreateSpecificationDetails({
            request,
            user,
        });

        return result;
    });
}

exports.post = CreateSpecificationDetails;

// @Route('drydock/specification-details/create-specification-details')
export class CreateSpecificationDetailsController extends Controller {
    @Post()
    public async CreateSpecificationDetails(@Request() request: CommandRequest): Promise<string> {
        const query = new CreateSpecificationDetailsCommand();

        const result = await query.ExecuteAsync(request);

        return result;
    }
}
