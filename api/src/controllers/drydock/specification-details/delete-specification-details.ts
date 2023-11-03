import { Request, Response } from 'express';

import { DeleteSpecificationDetailsCommand } from '../../../application-layer/drydock/specification-details/DeleteSpecificationDetailsCommand';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function deleteSpecificationDetails(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const command = new DeleteSpecificationDetailsCommand();

        return await command.ExecuteAsync(request);
    });
}

exports.put = deleteSpecificationDetails;
