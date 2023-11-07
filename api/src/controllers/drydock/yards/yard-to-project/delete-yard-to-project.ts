import { Request, Response } from 'express';

import { DeleteYardToProjectCommand } from '../../../../application-layer/drydock/yards/yard-to-project/DeleteYardToProjectCommand';
import { MiddlewareHandler } from '../../core/middleware/MiddlewareHandler';

async function deleteYardToProject(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const command = new DeleteYardToProjectCommand();

        return await command.ExecuteAsync(request.body);
    });
}

exports.put = deleteYardToProject;
