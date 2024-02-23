import { ProjectTemplatesService } from '../../../../bll/drydock/project-templates/project-templates.service';
import { Req } from '../../../../common/drydock/ts-helpers/req-res';
import { IGetProjectTemplateStandardJobsGridDtoResult } from '../../../../dal/drydock/ProjectTemplate/IGetProjectTemplateStandardJobsGridDto';
import { ProjectTemplateRepository } from '../../../../dal/drydock/ProjectTemplate/ProjectTemplateRepository';
import { ProjectTemplateStandardJobRepository } from '../../../../dal/drydock/ProjectTemplate/ProjectTemplateStandardJobRepository';
import { ODataBodyDto } from '../../../../shared/dto';
import { Query } from '../../core/cqrs/Query';

export class GetProjectTemplateStandardJobsGridQuery extends Query<
    Req<ODataBodyDto>,
    IGetProjectTemplateStandardJobsGridDtoResult
> {
    projectTemplateRepository: ProjectTemplateRepository;
    projectTemplateStandardJobRepository: ProjectTemplateStandardJobRepository;
    projectTemplatesService: ProjectTemplatesService;

    constructor() {
        super();

        this.projectTemplateRepository = new ProjectTemplateRepository();
        this.projectTemplateStandardJobRepository = new ProjectTemplateStandardJobRepository();
        this.projectTemplatesService = new ProjectTemplatesService();
    }

    /**
     * Get project templates standard jobs grid
     * @param request Http request
     * @returns Projects templates standard jobs grid
     */
    protected async MainHandlerAsync(
        request: Req<ODataBodyDto>,
    ): Promise<IGetProjectTemplateStandardJobsGridDtoResult> {
        const result = await this.projectTemplateStandardJobRepository.GetProjectTemplateStandardJobsGridData(request);

        return this.projectTemplatesService.mapStandardJobsDataToDto(result);
    }
}
