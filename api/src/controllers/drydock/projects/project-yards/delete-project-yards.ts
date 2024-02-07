import * as express from 'express';
import { AccessRights } from 'j2utils';
import { Body, Controller, Put, Request, Route } from 'tsoa';

import { DeleteProjectYardsCommand } from '../../../../application-layer/drydock/projects/project-yards/DeleteProjectYardsCommand';
import { DeleteProjectYardsDto } from '../../../../application-layer/drydock/projects/project-yards/dtos/DeleteProjectYardsDto';
import { MiddlewareHandler } from '../../core/middleware/MiddlewareHandler';

@Route('drydock/projects/project-yards/delete-project-yards')
export class DeleteProjectYardsController extends Controller {
    @Put()
    public async deleteProjectYards(
        @Request() request: express.Request,
        @Body() dto: DeleteProjectYardsDto,
    ): Promise<void> {
        const { UserUID: deletedBy } = AccessRights.authorizationDecode(request);

        dto.deletedBy = deletedBy;

        const query = new DeleteProjectYardsCommand();

        const result = await query.ExecuteAsync(dto);

        return result;
    }
}

exports.put = new MiddlewareHandler().ExecuteHandlerAsync(async (request: express.Request) => {
    return new DeleteProjectYardsController().deleteProjectYards(request, request.body);
});
