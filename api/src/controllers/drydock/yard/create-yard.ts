import { Request, Response } from 'express';

import { CreateYardCommand } from '../../../application-layer/drydock/yard/CreateYardCommand';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function CreateYard(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const command = new CreateYardCommand();

        return await command.ExecuteAsync(request.body);
    });
}

exports.post = CreateYard;
