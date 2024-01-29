import { Request, Response } from 'express';
import { Body, Controller, Put } from 'tsoa';

import { DeleteProjectYardsCommand } from '../../../../application-layer/drydock/projects/project-yards/DeleteProjectYardsCommand';
import { MiddlewareHandler } from '../../core/middleware/MiddlewareHandler';

async function deleteProjectYards(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const result = await new DeleteProjectYardsController().deleteProjectYards(request);

        return result;
    });
}

exports.put = deleteProjectYards;

// @Route('drydock/projects/project-yards/delete-project-yards')
export class DeleteProjectYardsController extends Controller {
    @Put()
    public async deleteProjectYards(@Body() request: Request): Promise<void> {
        const query = new DeleteProjectYardsCommand();

        const result = await query.ExecuteAsync(request);

        return result;
    }
}
