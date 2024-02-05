import { Request, Response } from 'express';
import { Body, Controller, Post, Route } from 'tsoa';

import { DeleteProjectCommand } from '../../../application-layer/drydock/projects';
import { IDeleteProjectDto } from '../../../application-layer/drydock/projects/dtos/IDeleteProjectDto';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function deleteProject(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const dto = request.body as IDeleteProjectDto;

        const result = await new DeleteProjectController().deleteProject(dto);

        return result;
    });
}

exports.post = deleteProject;

// @Route('drydock/projects/delete-project')
export class DeleteProjectController extends Controller {
    @Post()
    public async deleteProject(@Body() dto: IDeleteProjectDto): Promise<void> {
        const query = new DeleteProjectCommand();

        const result = await query.ExecuteAsync(dto);

        return result;
    }
}
