import { Controller, Get, Route } from 'tsoa';

import { ProjectTypesQuery } from '../../../../application-layer/drydock/projects/project-types/ProjectTypesQuery';
import { IProjectTypeResultDto } from '../../../../dal/drydock/projects/dtos/IProjectTypeResultDto';
import { MiddlewareHandler } from '../../core/middleware/MiddlewareHandler';

@Route('drydock/projects/project-types')
export class GetProjectTypesActionController extends Controller {
    @Get()
    public async getProjectTypesAction(): Promise<IProjectTypeResultDto[]> {
        const query = new ProjectTypesQuery();

        const result = await query.ExecuteAsync();

        return result;
    }
}

exports.get = new MiddlewareHandler().ExecuteHandlerAsync(new GetProjectTypesActionController().getProjectTypesAction);
