import * as express from 'express';
import { AccessRights } from 'j2utils';
import { Body, Controller, Put, Request, Route, Tags } from 'tsoa';

import { UserFromToken } from '../../../application-layer/drydock/core/cqrs/UserDto';
import { UpdateProjectTemplateCommand } from '../../../application-layer/drydock/project-template/UpdateProjectTemplateCommand/UpdateProjectTemplateCommand';
import { UpdateProjectTemplateModel } from '../../../application-layer/drydock/project-template/UpdateProjectTemplateCommand/UpdateProjectTemplateModel';
import { Req } from '../../../common/drydock/ts-helpers/req-res';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

@Tags('Project Template')
@Route('drydock/project-templates/update-project-template')
export class UpdateProjectTemplateController extends Controller {
    @Put()
    public async UpdateProjectTemplate(
        @Body() model: UpdateProjectTemplateModel,
        @Request() request: Req<UpdateProjectTemplateModel>,
    ): Promise<void> {
        const command = new UpdateProjectTemplateCommand();

        const authUser = AccessRights.authorizationDecode(request) as UserFromToken;

        model.UpdatedBy = authUser.UserID;

        const result = await command.ExecuteRequestAsync(model, UpdateProjectTemplateModel);

        return result;
    }
}

exports.put = new MiddlewareHandler().ExecuteHandlerAsync(async (request: express.Request) => {
    return new UpdateProjectTemplateController().UpdateProjectTemplate(request.body, request);
});
