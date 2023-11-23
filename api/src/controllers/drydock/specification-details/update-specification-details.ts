import { Request, Response } from 'express';

import { UpdateSpecificationDetailsCommand } from '../../../application-layer/drydock/specification-details/UpdateSpecificationDetailsCommand';
import { AuthRequest } from '../core/auth-req.type';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function updateSpecificationDetails(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: AuthRequest) => {
        const command = new UpdateSpecificationDetailsCommand();

        return command.ExecuteAsync(request);
    });
}

exports.put = updateSpecificationDetails;
