import { Request, Response } from 'express';

import { CreateProjectYardsCommand } from '../../../../application-layer/drydock/projects/project-yards/CreateProjectYardsCommand';
import { MiddlewareHandler } from '../../core/middleware/MiddlewareHandler';

async function CreateProjectYards(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const command = new CreateProjectYardsCommand();

        return command.ExecuteAsync(request);
    });
}

exports.post = CreateProjectYards;
