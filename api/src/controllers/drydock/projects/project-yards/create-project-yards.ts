import * as express from 'express';
import { AccessRights } from 'j2utils';
import { Body, Controller, Post, Request, Route } from 'tsoa';

import { CreateProjectYardsCommand } from '../../../../application-layer/drydock/projects/project-yards/CreateProjectYardsCommand';
import { CreateProjectYardsDto } from '../../../../application-layer/drydock/projects/project-yards/dtos/CreateProjectYardsDto';
import { MiddlewareHandler } from '../../core/middleware/MiddlewareHandler';

async function CreateProjectYards(req: express.Request, res: express.Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: express.Request) => {
        const result = await new CreateProjectYardsController().CreateProjectYards(request.body, request);

        return result;
    });
}

exports.post = CreateProjectYards;

@Route('drydock/projects/project-yards/create-project-yards')
export class CreateProjectYardsController extends Controller {
    @Post()
    public async CreateProjectYards(
        @Body() dto: CreateProjectYardsDto,
        @Request() request: express.Request,
    ): Promise<void> {
        const query = new CreateProjectYardsCommand();

        const { UserUID: createdBy } = AccessRights.authorizationDecode(request);

        dto.createdBy = createdBy;

        const result = await query.ExecuteAsync(dto);

        return result;
    }
}
