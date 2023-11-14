import { Request, Response } from 'express';

import { UpdateYardProjectsCommand } from '../../../application-layer/drydock/yard-projects/UpdateYardProjectsCommand';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function updateProjectYards(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const command = new UpdateYardProjectsCommand();

        return await command.ExecuteAsync(request.body);
    });
}

exports.put = updateProjectYards;
