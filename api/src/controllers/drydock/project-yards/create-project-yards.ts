import { Request, Response } from 'express';

import { CreateYardProjectsCommand } from '../../../application-layer/drydock/yard-projects/CreateYardProjectsCommand';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function CreateProjectYards(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const command = new CreateYardProjectsCommand();

        return await command.ExecuteAsync(request);
    });
}

exports.post = CreateProjectYards;
