import { Req } from '../../../../common/drydock/ts-helpers/req-res';
import { IGetProjectTemplateGridDto } from '../../../../dal/drydock/ProjectTemplate/IGetProjectTemplateGridDto';
import { ProjectTemplateRepository } from '../../../../dal/drydock/ProjectTemplate/ProjectTemplateRepository';
import { ProjectTemplateStandardJobRepository } from '../../../../dal/drydock/ProjectTemplate/ProjectTemplateStandardJobRepository';
import { ODataBodyDtoWithFilters } from '../../../../shared/dto/oDataDto';
import { ODataResult } from '../../../../shared/interfaces';
import { Query } from '../../core/cqrs/Query';
import { ProjectTemplateGridFiltersKeys, projectTemplateGridFiltersKeys } from '../ProjectTemplateConstants';

export class GetProjectTemplateGridQuery extends Query<
    Req<ODataBodyDtoWithFilters>,
    ODataResult<IGetProjectTemplateGridDto>
> {
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
    protected async MainHandlerAsync(
        request: Req<ODataBodyDtoWithFilters>,
    ): Promise<ODataResult<IGetProjectTemplateGridDto>> {
        const filters = request.body.gridFilters.reduce(
            (acc, { odataKey, selectedValues }) =>
                projectTemplateGridFiltersKeys.includes(odataKey as ProjectTemplateGridFiltersKeys) &&
                Array.isArray(selectedValues) &&
                selectedValues?.length
                    ? {
                          ...acc,
                          [odataKey]: selectedValues,
                      }
                    : acc,
            {} as Record<ProjectTemplateGridFiltersKeys, string[]>,
        );

        const result = await this.projectTemplateRepository.GetProjectTemplateGridData(request, filters);

        return result;
    }
}
