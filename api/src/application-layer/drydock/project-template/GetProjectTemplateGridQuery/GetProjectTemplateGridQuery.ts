import { Req } from '../../../../common/drydock/ts-helpers/req-res';
import { IGetProjectTemplateGridDto } from '../../../../dal/drydock/ProjectTemplate/IGetProjectTemplateGridDto';
import { ProjectTemplateRepository } from '../../../../dal/drydock/ProjectTemplate/ProjectTemplateRepository';
import { ProjectTemplateStandardJobRepository } from '../../../../dal/drydock/ProjectTemplate/ProjectTemplateStandardJobRepository';
import { ODataBodyDto } from '../../../../shared/dto';
import { ODataResult } from '../../../../shared/interfaces';
import { Query } from '../../core/cqrs/Query';

export class GetProjectTemplateGridQuery extends Query<Req<ODataBodyDto>, ODataResult<IGetProjectTemplateGridDto>> {
    projectTemplateRepository: ProjectTemplateRepository;
    projectTemplateStandardJobRepository: ProjectTemplateStandardJobRepository;

    constructor() {
        super();

        this.projectTemplateRepository = new ProjectTemplateRepository();
        this.projectTemplateStandardJobRepository = new ProjectTemplateStandardJobRepository();
    }

    /**
     * Get project templates grid
     * @param request Http request
     * @returns Projects templates grid
     */
    protected async MainHandlerAsync(request: Req<ODataBodyDto>): Promise<ODataResult<IGetProjectTemplateGridDto>> {
        const result = await this.projectTemplateRepository.GetProjectTemplateGridData(request);

        return result;
    }
}
