import * as express from 'express';
import { AccessRights } from 'j2utils';
import { Body, Controller, Post, Request, Route, Tags } from 'tsoa';

import { UserFromToken } from '../../../application-layer/drydock/core/cqrs/UserDto';
import { CreateProjectTemplateCommand } from '../../../application-layer/drydock/project-template/CreateProjectTemplateCommand/CreateProjectTemplateCommand';
import { CreateProjectTemplateModel } from '../../../application-layer/drydock/project-template/CreateProjectTemplateCommand/CreateProjectTemplateModel';
import { Req } from '../../../common/drydock/ts-helpers/req-res';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

@Tags('Project Template')
@Route('drydock/project-templates/create-project-template')
export class CreateProjectTemplateController extends Controller {
    @Post()
    public async CreateProjectTemplate(
        @Body() model: CreateProjectTemplateModel,
        @Request() request: Req<CreateProjectTemplateModel>,
    ): Promise<void> {
        const command = new CreateProjectTemplateCommand();

        const authUser = AccessRights.authorizationDecode(request) as UserFromToken;

        model.CreatedBy = authUser.UserID;

        const result = await command.ExecuteRequestAsync(model, CreateProjectTemplateModel);

        return result;
    }
}

exports.post = new MiddlewareHandler().ExecuteHandlerAsync(async (request: express.Request) => {
    return new CreateProjectTemplateController().CreateProjectTemplate(request.body, request);
});
