import { Request, Response } from 'express';
import { Body, Controller, Post } from 'tsoa';

import { CreateProjectYardsCommand } from '../../../../application-layer/drydock/projects/project-yards/CreateProjectYardsCommand';
import { MiddlewareHandler } from '../../core/middleware/MiddlewareHandler';

async function CreateProjectYards(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const result = await new CreateProjectYardsController().CreateProjectYards(request);

        return result;
    });
}

exports.post = CreateProjectYards;

// @Route('drydock/projects/project-yards/create-project-yards')
export class CreateProjectYardsController extends Controller {
    @Post()
    public async CreateProjectYards(@Body() request: Request): Promise<void> {
        const query = new CreateProjectYardsCommand();

        const result = await query.ExecuteAsync(request);

        return result;
    }
}
