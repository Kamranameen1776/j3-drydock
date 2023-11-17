import { Request, Response } from 'express';

import { CreateProjectCommand } from '../../../application-layer/drydock/projects/create-project/CreateProjectCommand';
import { CreateProjectDataDto } from '../../../application-layer/drydock/projects/create-project/CreateProjectDataDto';
import { CreateProjectDto } from '../../../bll/drydock/projects/dtos/ICreateProjectDto';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function createProject(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const token: string = request.headers.authorization as string;
        const createProjectDto: CreateProjectDto = request.body as CreateProjectDto;

        const createProjectDataDto: CreateProjectDataDto = {
            Token: token,
            ProjectDto: createProjectDto,
        };

        const command = new CreateProjectCommand();

        return command.ExecuteAsync(createProjectDataDto);
    });
}

exports.post = createProject;
