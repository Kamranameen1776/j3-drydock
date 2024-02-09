import * as express from 'express';
import { Body, Controller, Post, Route, Tags } from 'tsoa';

import { CreateProjectTemplateCommand } from '../../../application-layer/drydock/project-template/CreateProjectTemplateCommand/CreateProjectTemplateCommand';
import { CreateProjectTemplateModel } from '../../../application-layer/drydock/project-template/CreateProjectTemplateCommand/CreateProjectTemplateModel';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

@Tags('Project Template')
@Route('drydock/project-templates/create-project-template')
export class CreateProjectTemplateController extends Controller {
    @Post()
    public async CreateProjectTemplate(@Body() model: CreateProjectTemplateModel): Promise<void> {
        const command = new CreateProjectTemplateCommand();

        const result = await command.ExecuteAsync(model);

        return result;
    }
}

exports.post = new MiddlewareHandler().ExecuteHandlerAsync(async (request: express.Request) => {
    return new CreateProjectTemplateController().CreateProjectTemplate(request.body);
});
