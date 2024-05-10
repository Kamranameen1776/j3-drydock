import { Request } from 'express';
import { Controller, Get, Query, Route } from 'tsoa';

import { GetProjectYardsResultDto } from '../../../../application-layer/drydock/projects/project-yards/dtos/GetProjectYardsResultDto';
import { GetProjectYardsQuery } from '../../../../application-layer/drydock/projects/project-yards/GetProjectYardsQuery';
import { MiddlewareHandler } from '../../core/middleware/MiddlewareHandler';

@Route('drydock/projects/project-yards/get-project-yards')
export class GetProjectYardsController extends Controller {
    @Get()
    public async getProjectYards(@Query() uid: string): Promise<GetProjectYardsResultDto[]> {
        const query = new GetProjectYardsQuery();

        const result = await query.ExecuteAsync(uid);

        return result;
    }
}

exports.get = new MiddlewareHandler().ExecuteHandlerAsync(async (request: Request) => {
    return new GetProjectYardsController().getProjectYards(request.query.uid as string);
});
