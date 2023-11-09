import { Request, Response } from 'express';

import { DeleteYardProjectsCommand } from '../../../application-layer/drydock/yard-projects/DeleteYardProjectsCommand';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function deleteYardProjects(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const command = new DeleteYardProjectsCommand();

        return await command.ExecuteAsync(request.body);
    });
}

exports.put = deleteYardProjects;
