import { Request, Response } from 'express';

import { UpdateProjectCommand } from '../../../application-layer/drydock/projects';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function updateProject(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const command = new UpdateProjectCommand();

        return command.ExecuteAsync(request.body);
    });
}

exports.put = updateProject;
