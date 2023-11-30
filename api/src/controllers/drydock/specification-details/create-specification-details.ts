import { Request, Response } from 'express';

import { UserFromToken } from '../../../application-layer/drydock/core/cqrs/UserDto';
import { CreateSpecificationDetailsCommand } from '../../../application-layer/drydock/specification-details/CreateSpecificationDetailsCommand';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function CreateSpecificationDetails(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request, _, user: UserFromToken) => {
        const command = new CreateSpecificationDetailsCommand();

        return command.ExecuteAsync({
            request,
            user,
        });
    });
}

exports.post = CreateSpecificationDetails;
