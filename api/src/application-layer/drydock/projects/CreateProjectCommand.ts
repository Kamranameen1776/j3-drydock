/* eslint-disable @typescript-eslint/no-empty-function */
import { LibVesselsEntity } from 'entity/drydock/dbo/LibVesselsEntity';
import { Request } from 'express';

import { ProjectService } from '../../../bll/drydock/projects/ProjectService';
import { ProjectsRepository } from '../../../dal/drydock/projects/ProjectsRepository';
import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';
import { CreateProjectDto } from './dtos/CreateProjectDto';

export class CreateProjectCommand extends Command<Request, void> {
    projectsRepository: ProjectsRepository;
    projectsService: ProjectService;
    uow: UnitOfWork;

    constructor() {
        super();

        this.projectsRepository = new ProjectsRepository();
        this.projectsService = new ProjectService();
        this.uow = new UnitOfWork();
    }

    protected async AuthorizationHandlerAsync(request: Request): Promise<void> {}

    protected async ValidationHandlerAsync(request: Request): Promise<void> {
        if (!request) {
            throw new Error('Request is null');
        }
    }

    /**
     *
     * @param request Project data for creation of the new project
     * @returns New created project result
     */
    protected async MainHandlerAsync(request: Request): Promise<void> {
        const token: string = request.headers.authorization as string;
        const body: CreateProjectDto = request.body;

        body.CreatedAtOffice = await this.projectsService.IsOffice();
        body.ProjectCode = await this.projectsService.GetProjectCode();
        body.ProjectStateId = 1;

        const vessel: LibVesselsEntity = await this.projectsRepository.GetVesselByUid(body.VesselUid);
        const taskManagerData = await this.projectsService.TaskManagerIntegration(body, vessel, token);
        body.TaskManagerUid = taskManagerData.uid;

        await this.uow.ExecuteAsync(async (queryRunner) => {
            const projectId = await this.projectsRepository.CreateProject(body, queryRunner);
            return projectId;
        });

        return;
    }
}
