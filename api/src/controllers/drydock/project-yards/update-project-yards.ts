import { Request, Response } from 'express';

import { UpdateProjectYardsCommand } from '../../../application-layer/drydock/project-yards/UpdateProjectYardsCommand';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function updateProjectYards(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const command = new UpdateProjectYardsCommand();

        return command.ExecuteAsync(request.body);
    });
}

exports.put = updateProjectYards;
