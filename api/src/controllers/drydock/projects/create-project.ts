import * as express from 'express';
import { Body, Controller, Post, Request, Route } from 'tsoa';

import { CreateProjectCommand } from '../../../application-layer/drydock/projects';
import { CreateProjectDataDto } from '../../../application-layer/drydock/projects/create-project/CreateProjectDataDto';
import { CreateProjectDto } from '../../../bll/drydock/projects/dtos/ICreateProjectDto';
import { IProjectsForMainPageRecordDto } from '../../../dal/drydock/projects/dtos/IProjectsForMainPageRecordDto';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

@Route('drydock/projects/create-project')
export class CreateProjectController extends Controller {
    @Post()
    public async createProject(
        @Request() request: express.Request,
        @Body() createProjectDto: CreateProjectDto,
    ): Promise<IProjectsForMainPageRecordDto[]> {
        const token: string = request.headers.authorization as string;

        const query = new CreateProjectCommand();

        const dto: CreateProjectDataDto = {
            Token: token,
            ProjectDto: createProjectDto,
        };

        const result = await query.ExecuteAsync(dto);

        return result;
    }
}

exports.post = new MiddlewareHandler().ExecuteHandlerAsync(async (request: express.Request) => {
    return new CreateProjectController().createProject(request, request.body);
});
