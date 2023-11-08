import { Request, Response } from 'express';

import { CreateLinkedYardsCommand } from '../../../../application-layer/drydock/yards/linked-yards/CreateLinkedYardsCommand';
import { MiddlewareHandler } from '../../core/middleware/MiddlewareHandler';

async function CreateLinkedYards(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const command = new CreateLinkedYardsCommand();

        return await command.ExecuteAsync(request.body);
    });
}

exports.post = CreateLinkedYards;
