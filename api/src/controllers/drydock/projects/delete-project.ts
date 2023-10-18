import { Request, Response } from 'express';

import { DeleteProjectCommand } from '../../../application-layer/drydock/projects';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function deleteProject(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const command = new DeleteProjectCommand();
        
        return await command.ExecuteAsync(request.body);
    });
}

exports.delete = deleteProject;
