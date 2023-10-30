import { Request, Response } from 'express';

import { CreateSpecificationDetailsCommand } from '../../../application-layer/drydock/specification-details/CreateSpecificationDetailsCommand';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function CreateSpecificationDetails(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const command = new CreateSpecificationDetailsCommand();

        return await command.ExecuteAsync(request);
    });
}

exports.post = CreateSpecificationDetails;
