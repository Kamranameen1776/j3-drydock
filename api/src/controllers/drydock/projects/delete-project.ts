import { Request } from 'express';
import { Body, Controller, Post, Route } from 'tsoa';

import { DeleteProjectCommand } from '../../../application-layer/drydock/projects';
import { IDeleteProjectDto } from '../../../application-layer/drydock/projects/dtos/IDeleteProjectDto';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

@Route('drydock/projects/delete-project')
export class DeleteProjectController extends Controller {
    @Post()
    public async deleteProject(@Body() dto: IDeleteProjectDto): Promise<void> {
        const query = new DeleteProjectCommand();

        const result = await query.ExecuteAsync(dto);

        return result;
    }
}

exports.post = new MiddlewareHandler().ExecuteHandlerAsync(async (request: Request) => {
    return new DeleteProjectController().deleteProject(request.body as IDeleteProjectDto);
});
