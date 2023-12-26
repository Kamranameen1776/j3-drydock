import { Request, Response } from 'express';
import { AccessRights } from 'j2utils';

import { UpdateProjectCommand } from '../../../application-layer/drydock/projects';
import { UpdateProjectDto } from '../../../application-layer/drydock/projects/dtos/UpdateProjectDto';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function updateProject(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const user = AccessRights.authorizationDecode(request);

        const command = new UpdateProjectCommand();

        const dto = request.body as UpdateProjectDto;
        dto.UpdatedBy = user.UserUID;

        return command.ExecuteAsync(dto);
    });
}

exports.put = updateProject;
