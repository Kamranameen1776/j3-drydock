import { Req } from '../../../../common/drydock/ts-helpers/req-res';
import { IGetProjectTemplateStandardJobsGridDto } from '../../../../dal/drydock/ProjectTemplate/IGetProjectTemplateStandardJobsGridDto';
import { ProjectTemplateRepository } from '../../../../dal/drydock/ProjectTemplate/ProjectTemplateRepository';
import { ProjectTemplateStandardJobRepository } from '../../../../dal/drydock/ProjectTemplate/ProjectTemplateStandardJobRepository';
import { ODataBodyDto } from '../../../../shared/dto';
import { ODataResult } from '../../../../shared/interfaces';
import { Query } from '../../core/cqrs/Query';

export class GetProjectTemplateStandardJobsGridQuery extends Query<
    Req<ODataBodyDto>,
    ODataResult<IGetProjectTemplateStandardJobsGridDto>
> {
    projectTemplateRepository: ProjectTemplateRepository;
    projectTemplateStandardJobRepository: ProjectTemplateStandardJobRepository;

    constructor() {
        super();

        this.projectTemplateRepository = new ProjectTemplateRepository();
        this.projectTemplateStandardJobRepository = new ProjectTemplateStandardJobRepository();
    }

    protected async AuthorizationHandlerAsync(request: Req<ODataBodyDto>): Promise<void> {
        return;
    }

    protected async ValidationHandlerAsync(request: Req<ODataBodyDto>): Promise<void> {
        // TODO: add model validation
        return;
    }

    /**
     * Get project templates standard jobs grid
     * @param request Http request
     * @returns Projects templates standard jobs grid
     */
    protected async MainHandlerAsync(
        request: Req<ODataBodyDto>,
    ): Promise<ODataResult<IGetProjectTemplateStandardJobsGridDto>> {
        const result = await this.projectTemplateStandardJobRepository.GetProjectTemplateStandardJobsGridData(request);

        return result;
    }
}
