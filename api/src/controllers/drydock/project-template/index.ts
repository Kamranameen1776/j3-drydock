import * as express from 'express';
import { Controller, Get, Query, Request, Route, Tags } from 'tsoa';

import { GetProjectTemplateQuery } from '../../../application-layer/drydock/project-template/GetProjectTemplateQuery';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

@Tags('Project Template')
@Route('drydock/project-template')
export class ProjectTemplateController extends Controller {
    @Get()
    public async getProject(@Query() projectTemplateUid: string): Promise<unknown> {
        const query = new GetProjectTemplateQuery();

        const result = await query.ExecuteAsync(projectTemplateUid);

        return result;
    }
}

exports.get = new MiddlewareHandler().ExecuteHandlerAsync(async (request: express.Request) => {
    return new ProjectTemplateController().getProject(request.query.projectTemplateUid as string);
});
