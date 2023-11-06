import { Request, Response } from 'express';

import { DeleteYardCommand } from '../../../application-layer/drydock/yard/DeleteYardCommand';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function deleteYard(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const command = new DeleteYardCommand();

        return await command.ExecuteAsync(request.body);
    });
}

exports.put = deleteYard;
