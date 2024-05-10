import * as express from 'express';
import { Controller, Get, Query, Route, Tags } from 'tsoa';

import { GetProjectTemplateModel } from '../../../application-layer/drydock/project-template/GetProjectTemplateQuery/GetProjectTemplateModel';
import { GetProjectTemplateQuery } from '../../../application-layer/drydock/project-template/GetProjectTemplateQuery/GetProjectTemplateQuery';
import { IGetProjectTemplateResponse } from '../../../application-layer/drydock/project-template/GetProjectTemplateQuery/IGetProjectTemplateResponse';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

@Tags('Project Template')
@Route('drydock/project-templates/get-project-template')
export class ProjectTemplateController extends Controller {
    @Get()
    public async getProject(@Query() projectTemplateUid: string): Promise<IGetProjectTemplateResponse> {
        const query = new GetProjectTemplateQuery();

        const model = new GetProjectTemplateModel();
        model.ProjectTemplateUid = projectTemplateUid;

        const result = await query.ExecuteRequestAsync(model, GetProjectTemplateModel);

        return result;
    }
}

exports.get = new MiddlewareHandler().ExecuteHandlerAsync(async (request: express.Request) => {
    return new ProjectTemplateController().getProject(request.query.projectTemplateUid as string);
});
