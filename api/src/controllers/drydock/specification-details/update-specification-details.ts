import { Request, Response } from 'express';

import { UserFromToken } from '../../../application-layer/drydock/core/cqrs/UserDto';
import { UpdateSpecificationDetailsCommand } from '../../../application-layer/drydock/specification-details/UpdateSpecificationDetailsCommand';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function updateSpecificationDetails(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request, _, user: UserFromToken) => {
        const command = new UpdateSpecificationDetailsCommand();

        return command.ExecuteAsync({ request, user });
    });
}

exports.put = updateSpecificationDetails;
