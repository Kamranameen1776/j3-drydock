import * as express from 'express';
import { AccessRights } from 'j2utils';
import { Body, Controller, Post, Request, Route } from 'tsoa';

import { CreateSpecificationFromStandardJobsCommand } from '../../../application-layer/drydock/specification-details/CreateSpecificationFromStandardJobCommand';
import { CreateSpecificationFromProjectTemplateDto } from '../../../dal/drydock/specification-details/dtos/ICreateSpecificationFromProjectTemplateDto';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

async function createSpecificationFromProjectTemplate(req: express.Request, res: express.Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: express.Request) => {
        const result =
            await new CreateSpecificationFromProjectTemplateController().createSpecificationFromProjectTemplate(
                request.body,
                request,
            );

        return result;
    });
}

exports.post = createSpecificationFromProjectTemplate;

@Route('drydock/specification-details/create-specification-from-project-template')
export class CreateSpecificationFromProjectTemplateController extends Controller {
    @Post()
    public async createSpecificationFromProjectTemplate(
        @Body() dto: CreateSpecificationFromProjectTemplateDto,
        @Request() request: express.Request,

        // TODO: check if newer version of tsoa supports this
        // ): Promise<SpecificationDetailsEntity[]> {
    ): Promise<unknown> {
        const { UserUID: createdBy } = AccessRights.authorizationDecode(request);

        dto.createdBy = createdBy;
        dto.token = request.headers.authorization as string;

        const query = new CreateSpecificationFromStandardJobsCommand();

        const result = await query.ExecuteAsync(dto);

        return result;
    }
}
