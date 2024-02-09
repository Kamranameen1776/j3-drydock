import { ApplicationException } from '../../../../bll/drydock/core/exceptions';
import { ProjectTemplateRepository } from '../../../../dal/drydock/ProjectTemplate/ProjectTemplateRepository';
import { ProjectTemplateStandardJobRepository } from '../../../../dal/drydock/ProjectTemplate/ProjectTemplateStandardJobRepository';
import { Query } from '../../core/cqrs/Query';
import { IGetProjectTemplateResponse } from './IGetProjectTemplateResponse';

export class GetProjectTemplateQuery extends Query<string, IGetProjectTemplateResponse> {
    projectTemplateRepository: ProjectTemplateRepository;
    projectTemplateStandardJobRepository: ProjectTemplateStandardJobRepository;

    constructor() {
        super();

        this.projectTemplateRepository = new ProjectTemplateRepository();
        this.projectTemplateStandardJobRepository = new ProjectTemplateStandardJobRepository();
    }

    protected async AuthorizationHandlerAsync(request: string): Promise<void> {
        return;
    }

    protected async ValidationHandlerAsync(request: string): Promise<void> {
        // TODO: add model validation
        return;
    }

    /**
     * Get project templates
     * @param request Http request
     * @returns Projects templates
     */
    protected async MainHandlerAsync(request: string): Promise<IGetProjectTemplateResponse> {
        const projectTemplate = await this.projectTemplateRepository.TryGetProjectTemplateByUid(request);

        if (!projectTemplate) {
            throw new ApplicationException('Project template not found');
        }

        const dto: IGetProjectTemplateResponse = {
            ProjectTemplateUid: projectTemplate.uid,
            Description: projectTemplate.Description,
            Subject: projectTemplate.Subject,
            VesselTypeUid: projectTemplate.VesselTypeUid,
            ProjectTypeUid: projectTemplate.ProjectTypeUid,
        };

        return dto;
    }
}
