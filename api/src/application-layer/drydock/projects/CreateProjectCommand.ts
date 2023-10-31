import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { LibVesselsEntity } from 'entity/drydock/dbo/LibVesselsEntity';
import { Request } from 'express';

import { ProjectService } from '../../../bll/drydock/projects/ProjectService';
import { ICreateNewProjectDto } from '../../../dal/drydock/projects/dtos/ICreateNewProjectDto';
import { ProjectsRepository } from '../../../dal/drydock/projects/ProjectsRepository';
import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';
import { ICreateProjectDto } from './dtos/ICreateProjectDto';

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

    protected async AuthorizationHandlerAsync(request: Request): Promise<void> {
        return;
    }

    protected async ValidationHandlerAsync(request: Request): Promise<void> {
        if (!request) {
            throw new Error('Request is null');
        }
        const createProjectDto: ICreateProjectDto = plainToClass(ICreateProjectDto, request.body);
        const result = await validate(createProjectDto);
        if (result.length) {
            throw result;
        }
    }

    /**
     *
     * @param request Project data for creation of the new project
     * @returns New created project result
     */
    protected async MainHandlerAsync(request: Request): Promise<void> {
        const token: string = request.headers.authorization as string;
        const createProjectDto: ICreateProjectDto = request.body as ICreateProjectDto;

        createProjectDto.CreatedAtOffice = await this.projectsService.IsOffice();
        // TODO: change 1 to constant, enum, etc
        createProjectDto.ProjectStateId = 1;

        const vessel: LibVesselsEntity = await this.projectsRepository.GetVessel(createProjectDto.VesselId);

        const taskManagerData = await this.projectsService.TaskManagerIntegration(createProjectDto, vessel, token);

        createProjectDto.TaskManagerUid = taskManagerData.uid;

        const newProjectDto: ICreateNewProjectDto = {
            EndDate: createProjectDto.EndDate,
            StartDate: createProjectDto.StartDate,
            ProjectManagerUid: createProjectDto.ProjectManagerUid,
            ProjectTypeUid: createProjectDto.ProjectTypeUid,
            ProjectStateId: createProjectDto.ProjectStateId,
            ProjectCode: createProjectDto.ProjectCode,
            Subject: createProjectDto.Subject,
            VesselUid: vessel.uid,
            CreatedAtOffice: createProjectDto.CreatedAtOffice,
            TaskManagerUid: createProjectDto.TaskManagerUid,
        };

        await this.uow.ExecuteAsync(async (queryRunner) => {
            const projectId = await this.projectsRepository.CreateProject(newProjectDto, queryRunner);
            return projectId;
        });

        return;
    }
}
