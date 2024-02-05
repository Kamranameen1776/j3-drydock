import * as express from 'express';
import { AccessRights } from 'j2utils';
import { Body, Controller, Put, Request, Route } from 'tsoa';

import { DeleteProjectYardsCommand } from '../../../../application-layer/drydock/projects/project-yards/DeleteProjectYardsCommand';
import { DeleteProjectYardsDto } from '../../../../application-layer/drydock/projects/project-yards/dtos/DeleteProjectYardsDto';
import { MiddlewareHandler } from '../../core/middleware/MiddlewareHandler';

async function deleteProjectYards(req: express.Request, res: express.Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: express.Request) => {
        const result = await new DeleteProjectYardsController().deleteProjectYards(request.body, request);

        return result;
    });
}

exports.put = deleteProjectYards;

// @Route('drydock/projects/project-yards/delete-project-yards')
export class DeleteProjectYardsController extends Controller {
    @Put()
    public async deleteProjectYards(
        @Body() dto: DeleteProjectYardsDto,
        @Request() request: express.Request,
    ): Promise<void> {
        const { UserUID: deletedBy } = AccessRights.authorizationDecode(request);

        dto.deletedBy = deletedBy;

        const query = new DeleteProjectYardsCommand();

        const result = await query.ExecuteAsync(dto);

        return result;
    }
}
