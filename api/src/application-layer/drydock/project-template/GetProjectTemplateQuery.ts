import { ProjectTemplateRepository } from '../../../dal/drydock/ProjectTemplate/ProjectTemplateRepository';
import { Query } from '../core/cqrs/Query';

export class GetProjectTemplateQuery extends Query<string, unknown> {
    projectTemplateRepository: ProjectTemplateRepository;

    constructor() {
        super();

        this.projectTemplateRepository = new ProjectTemplateRepository();
    }

    protected async AuthorizationHandlerAsync(request: string): Promise<void> {
        return;
    }

    protected async ValidationHandlerAsync(request: string): Promise<void> {
        return;
    }

    /**
     * Get projects from main page
     * @param request Http request
     * @returns Projects from main page
     */
    protected async MainHandlerAsync(request: string): Promise<unknown> {
        const result = await this.projectTemplateRepository.TryGetProjectTemplateByUid(request);
        return result;
    }
}
