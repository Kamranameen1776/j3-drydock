import { Request, Response } from 'express';

import { DeleteProjectYardsCommand } from '../../../../application-layer/drydock/projects/project-yards/DeleteProjectYardsCommand';
import { MiddlewareHandler } from '../../core/middleware/MiddlewareHandler';

async function deleteProjectYards(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const command = new DeleteProjectYardsCommand();

        return command.ExecuteAsync(request);
    });
}

exports.put = deleteProjectYards;
