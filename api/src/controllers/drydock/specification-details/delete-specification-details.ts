import { Request, Response } from 'express';

import { UserFromToken } from '../../../application-layer/drydock/core/cqrs/UserDto';
import { DeleteSpecificationDetailsCommand } from '../../../application-layer/drydock/specification-details/DeleteSpecificationDetailsCommand';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function deleteSpecificationDetails(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request, _, user: UserFromToken) => {
        const command = new DeleteSpecificationDetailsCommand();

        return command.ExecuteAsync({ request, user });
    });
}

exports.put = deleteSpecificationDetails;
