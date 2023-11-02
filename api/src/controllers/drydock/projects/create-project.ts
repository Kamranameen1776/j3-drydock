import { Request, Response } from 'express';

import { CreateProjectCommand } from '../../../application-layer/drydock/projects';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function createProject(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const command = new CreateProjectCommand();

        return await command.ExecuteAsync(request);
    });
}

exports.post = createProject;
