import { Body, Controller, Post, Request, Route } from 'tsoa';

import { IProjectsFromMainPageRecordDto } from '../../../../application-layer/drydock/projects/projects-for-main-page/dtos/IProjectsFromMainPageRecordDto';
import { ProjectsFromMainPageQuery } from '../../../../application-layer/drydock/projects/projects-for-main-page/ProjectsFromMainPageQuery';
import { Req } from '../../../../common/drydock/ts-helpers/req-res';
import { ODataBodyDto } from '../../../../shared/dto';
import { ODataResult } from '../../../../shared/interfaces';
import { MiddlewareV2Handler } from '../../core/middleware/MiddlewareV2Handler';

@Route('drydock/projects/get-projects-for-main-page')
export class GetProjectsForMainPageActionController extends Controller {
    @Post()
    public async getProjectsForMainPageAction(
        @Request() request: Req<ODataBodyDto>,
        @Body() odataBody: ODataBodyDto,
    ): Promise<ODataResult<IProjectsFromMainPageRecordDto>> {
        const middlewareHandler = new MiddlewareV2Handler();

        const result = await middlewareHandler.ExecuteAsync(this, request, async (request) => {
            const query = new ProjectsFromMainPageQuery();

            const result = await query.ExecuteAsync(request, ODataBodyDto);

            return result;
        });

        return result;
    }
}
