import * as express from 'express';
import { AccessRights } from 'j2utils';
import { Body, Controller, Put, Request, Route, Tags } from 'tsoa';
import { UpdateResult } from 'typeorm';

import { UserFromToken } from '../../../application-layer/drydock/core/cqrs/UserDto';
import { DeleteProjectTemplateCommand } from '../../../application-layer/drydock/project-template/DeleteProjectTemplateCommand/DeleteProjectTemplateCommand';
import { DeleteProjectTemplateModel } from '../../../application-layer/drydock/project-template/DeleteProjectTemplateCommand/DeleteProjectTemplateModel';
import { Req } from '../../../common/drydock/ts-helpers/req-res';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function deleteProjectTemplate(req: express.Request, res: express.Response) {
    const middlewareHandler = new MiddlewareHandler('standard_jobs');

    await middlewareHandler.ExecuteAsync(req, res, async (request: express.Request) => {
        const result = await new DeleteProjectTemplateController().deleteProjectTemplate(request.body, request);

        return result;
    });
}

exports.put = deleteProjectTemplate;

@Tags('Project Template')
@Route('drydock/project-templates/delete-project-template')
export class DeleteProjectTemplateController extends Controller {
    @Put()
    public async deleteProjectTemplate(
        @Body() body: DeleteProjectTemplateModel,
        @Request() request: Req<DeleteProjectTemplateModel>,
    ): Promise<UpdateResult> {
        const authUser = AccessRights.authorizationDecode(request) as UserFromToken;

        const dto: DeleteProjectTemplateModel = {
            ProjectTemplateUid: body.ProjectTemplateUid,
            DeletedBy: authUser.UserUID,
        };

        const query = new DeleteProjectTemplateCommand();

        const result = await query.ExecuteAsync(dto);

        return result;
    }
}
