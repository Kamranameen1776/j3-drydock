import { Request, Response } from 'express';
import { Body, Controller, Put } from 'tsoa';

import { UpdateProjectYardsCommand } from '../../../../application-layer/drydock/projects/project-yards/UpdateProjectYardsCommand';
import { MiddlewareHandler } from '../../core/middleware/MiddlewareHandler';

async function updateProjectYards(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const result = await new UpdateProjectYardsController().updateProjectYards(request);

        return result;
    });
}

exports.put = updateProjectYards;

// @Route('drydock/projects/project-yards/update-project-yards')
export class UpdateProjectYardsController extends Controller {
    @Put()
    public async updateProjectYards(@Body() request: Request): Promise<void> {
        const query = new UpdateProjectYardsCommand();

        const result = await query.ExecuteAsync(request);

        return result;
    }
}
