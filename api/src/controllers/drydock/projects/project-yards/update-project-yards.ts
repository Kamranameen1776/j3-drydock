import * as express from 'express';
import { AccessRights } from 'j2utils';
import { Body, Controller, Put, Request, Route } from 'tsoa';

import { UpdateProjectYardsDto } from '../../../../application-layer/drydock/projects/project-yards/dtos/UpdateProjectYardsDto';
import { UpdateProjectYardsCommand } from '../../../../application-layer/drydock/projects/project-yards/UpdateProjectYardsCommand';
import { MiddlewareHandler } from '../../core/middleware/MiddlewareHandler';

async function updateProjectYards(req: express.Request, res: express.Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: express.Request) => {
        const result = await new UpdateProjectYardsController().updateProjectYards(request.body, request);

        return result;
    });
}

exports.put = updateProjectYards;

// @Route('drydock/projects/project-yards/update-project-yards')
export class UpdateProjectYardsController extends Controller {
    @Put()
    public async updateProjectYards(
        @Body() dto: UpdateProjectYardsDto,
        @Request() request: express.Request,
    ): Promise<void> {
        const { UserUID: updatedBy } = AccessRights.authorizationDecode(request);

        dto.updatedBy = updatedBy;

        const query = new UpdateProjectYardsCommand();

        const result = await query.ExecuteAsync(dto);

        return result;
    }
}
