import { Request, Response } from 'express';

import { CreateYardSelectionCommand } from '../../../application-layer/drydock/yard-selection/CreateYardSelectionCommand';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function CreateYardSelection(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const command = new CreateYardSelectionCommand();

        return await command.ExecuteAsync(request.body);
    });
}

exports.post = CreateYardSelection;
