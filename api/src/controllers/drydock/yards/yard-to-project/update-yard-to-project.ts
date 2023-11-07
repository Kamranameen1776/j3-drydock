import { Request, Response } from 'express';

import { UpdateYardToProjectCommand } from '../../../../application-layer/drydock/yards/yard-to-project/UpdateYardToProjectCommand';
import { MiddlewareHandler } from '../../core/middleware/MiddlewareHandler';

async function updateYardToProject(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const command = new UpdateYardToProjectCommand();

        return await command.ExecuteAsync(request.body);
    });
}

exports.put = updateYardToProject;
