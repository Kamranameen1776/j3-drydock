import { ProjectTemplateRepository } from '../../../../dal/drydock/ProjectTemplate/ProjectTemplateRepository';
import { ProjectTemplateStandardJobRepository } from '../../../../dal/drydock/ProjectTemplate/ProjectTemplateStandardJobRepository';
import { Command } from '../../core/cqrs/Command';
import { CreateProjectTemplateModel } from './CreateProjectTemplateModel';

export class CreateProjectTemplateCommand extends Command<CreateProjectTemplateModel, void> {
    projectTemplateRepository: ProjectTemplateRepository;
    projectTemplateStandardJobRepository: ProjectTemplateStandardJobRepository;

    constructor() {
        super();

        this.projectTemplateRepository = new ProjectTemplateRepository();
        this.projectTemplateStandardJobRepository = new ProjectTemplateStandardJobRepository();
    }

    protected async AuthorizationHandlerAsync(request: CreateProjectTemplateModel): Promise<void> {
        return;
    }

    /**
     * Create project templates
     */
    protected async MainHandlerAsync(request: CreateProjectTemplateModel): Promise<void> {
        // TODO: add implementation
        return;
    }
}
