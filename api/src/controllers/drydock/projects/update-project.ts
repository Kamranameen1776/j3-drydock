import { Request, Response } from 'express';
import { AccessRights } from 'j2utils';
import { Body, Controller, Put, Route } from 'tsoa';

import { UpdateProjectCommand } from '../../../application-layer/drydock/projects';
import { UpdateProjectDto } from '../../../application-layer/drydock/projects/dtos/UpdateProjectDto';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function updateProject(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const user = AccessRights.authorizationDecode(request);

        const dto = request.body as UpdateProjectDto;
        dto.UpdatedBy = user.UserUID;

        const result = await new UpdateProjectController().updateProject(dto);

        return result;
    });
}

exports.put = updateProject;

@Route('drydock/projects/update-project')
export class UpdateProjectController extends Controller {
    @Put()
    public async updateProject(@Body() dto: UpdateProjectDto): Promise<void> {
        const query = new UpdateProjectCommand();

        const result = await query.ExecuteAsync(dto);

        return result;
    }
}
