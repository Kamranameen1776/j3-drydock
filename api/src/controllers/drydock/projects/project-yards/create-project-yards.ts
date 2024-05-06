import * as express from 'express';
import { AccessRights } from 'j2utils';
import { Body, Controller, Post, Request, Route } from 'tsoa';

import { CreateProjectYardsCommand } from '../../../../application-layer/drydock/projects/project-yards/CreateProjectYardsCommand';
import { CreateProjectYardsDto } from '../../../../application-layer/drydock/projects/project-yards/dtos/CreateProjectYardsDto';
import { MiddlewareHandler } from '../../core/middleware/MiddlewareHandler';

@Route('drydock/projects/project-yards/create-project-yards')
export class CreateProjectYardsController extends Controller {
    @Post()
    public async CreateProjectYards(
        @Request() request: express.Request,
        @Body() dto: CreateProjectYardsDto,
    ): Promise<void> {
        const query = new CreateProjectYardsCommand();

        const { UserUID: createdBy } = AccessRights.authorizationDecode(request);

        dto.createdBy = createdBy;

        const result = await query.ExecuteAsync(dto);

        return result;
    }
}

exports.post = new MiddlewareHandler().ExecuteHandlerAsync(async (request: express.Request) => {
    return new CreateProjectYardsController().CreateProjectYards(request, request.body);
});
