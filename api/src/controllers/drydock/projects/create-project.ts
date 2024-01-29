import { Request, Response } from 'express';
import { Body, Controller, Post } from 'tsoa';

import { CreateProjectCommand } from '../../../application-layer/drydock/projects';
import { CreateProjectDataDto } from '../../../application-layer/drydock/projects/create-project/CreateProjectDataDto';
import { CreateProjectDto } from '../../../bll/drydock/projects/dtos/ICreateProjectDto';
import { IProjectsForMainPageRecordDto } from '../../../dal/drydock/projects/dtos/IProjectsForMainPageRecordDto';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function createProject(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        const token: string = request.headers.authorization as string;
        const createProjectDto: CreateProjectDto = request.body as CreateProjectDto;

        const result = await new CreateProjectController().createProject(createProjectDto, token);

        return result;
    });
}

exports.post = createProject;

// @Route('drydock/projects/create-project')
export class CreateProjectController extends Controller {
    @Post()
    public async createProject(
        @Body() createProjectDto: CreateProjectDto,
        token: string,
    ): Promise<IProjectsForMainPageRecordDto[]> {
        const query = new CreateProjectCommand();

        const dto: CreateProjectDataDto = {
            Token: token,
            ProjectDto: createProjectDto,
        };

        const result = await query.ExecuteAsync(dto);

        return result;
    }
}
