import * as express from 'express';
import { Body, Controller, Put, Route, Tags } from 'tsoa';

import { UpdateProjectTemplateCommand } from '../../../application-layer/drydock/project-template/UpdateProjectTemplateCommand/UpdateProjectTemplateCommand';
import { UpdateProjectTemplateModel } from '../../../application-layer/drydock/project-template/UpdateProjectTemplateCommand/UpdateProjectTemplateModel';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

@Tags('Project Template')
@Route('drydock/project-templates/update-project-template')
export class UpdateProjectTemplateController extends Controller {
    @Put()
    public async UpdateProjectTemplate(@Body() model: UpdateProjectTemplateModel): Promise<void> {
        const command = new UpdateProjectTemplateCommand();

        const result = await command.ExecuteRequestAsync(model, UpdateProjectTemplateModel);

        return result;
    }
}

exports.put = new MiddlewareHandler().ExecuteHandlerAsync(async (request: express.Request) => {
    return new UpdateProjectTemplateController().UpdateProjectTemplate(request.body);
});
