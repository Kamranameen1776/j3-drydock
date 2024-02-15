import { ApplicationException } from '../../../../bll/drydock/core/exceptions';
import { ProjectTemplateRepository } from '../../../../dal/drydock/ProjectTemplate/ProjectTemplateRepository';
import { ProjectTemplateStandardJobRepository } from '../../../../dal/drydock/ProjectTemplate/ProjectTemplateStandardJobRepository';
import { Query } from '../../core/cqrs/Query';
import { GetProjectTemplateModel } from './GetProjectTemplateModel';
import { IGetProjectTemplateResponse } from './IGetProjectTemplateResponse';

export class GetProjectTemplateQuery extends Query<GetProjectTemplateModel, IGetProjectTemplateResponse> {
    projectTemplateRepository: ProjectTemplateRepository;
    projectTemplateStandardJobRepository: ProjectTemplateStandardJobRepository;

    constructor() {
        super();

        this.projectTemplateRepository = new ProjectTemplateRepository();
        this.projectTemplateStandardJobRepository = new ProjectTemplateStandardJobRepository();
    }

    /**
     * Get project templates
     * @param request Http request
     * @returns Projects templates
     */
    protected async MainHandlerAsync(request: GetProjectTemplateModel): Promise<IGetProjectTemplateResponse> {
        const projectTemplate = await this.projectTemplateRepository.TryGetProjectTemplateByUid(
            request.ProjectTemplateUid,
        );

        if (!projectTemplate) {
            throw new ApplicationException('Project template not found');
        }

        const dto: IGetProjectTemplateResponse = {
            ProjectTemplateUid: projectTemplate.uid,
            Description: projectTemplate.Description,
            Subject: projectTemplate.Subject,
            VesselTypeID: projectTemplate.vesselType as unknown[] as number[],
            ProjectTypeUid: projectTemplate.ProjectTypeUid,
        };

        return dto;
    }
}
