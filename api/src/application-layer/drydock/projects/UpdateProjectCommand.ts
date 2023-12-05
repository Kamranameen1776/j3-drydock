import { ProjectMapper } from '../../../bll/drydock/projects/ProjectMapper';
import { ProjectService } from '../../../bll/drydock/projects/ProjectService';
import { ProjectsRepository } from '../../../dal/drydock/projects/ProjectsRepository';
import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';
import { UpdateProjectDto } from './dtos/UpdateProjectDto';

export class UpdateProjectCommand extends Command<UpdateProjectDto, void> {
    projectsRepository: ProjectsRepository;
    projectsService: ProjectService;
    uow: UnitOfWork;

    constructor() {
        super();

        this.projectsRepository = new ProjectsRepository();
        this.projectsService = new ProjectService();
        this.uow = new UnitOfWork();
    }

    protected async ValidationHandlerAsync(request: UpdateProjectDto): Promise<void> {
        if (!request) {
            throw new Error('Request is null');
        }
    }

    /**
     *
     * @param request Project data for creation of the new project
     * @returns New created project result
     */
    protected async MainHandlerAsync(request: UpdateProjectDto): Promise<void> {
        await this.uow.ExecuteAsync(async (queryRunner) => {
            await this.projectsRepository.UpdateProject(request, queryRunner);

            const [record] = await this.projectsRepository.GetProject(request.uid);
            return new ProjectMapper().map(record);
        });
    }
}
