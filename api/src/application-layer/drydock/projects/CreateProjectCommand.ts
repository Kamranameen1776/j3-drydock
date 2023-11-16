import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { LibVesselsEntity } from 'entity/drydock/dbo/LibVesselsEntity';
import { Request } from 'express';

import { CreateProjectDto } from '../../../bll/drydock/projects/dtos/ICreateProjectDto';
import { ProjectService } from '../../../bll/drydock/projects/ProjectService';
import { ICreateNewProjectDto } from '../../../dal/drydock/projects/dtos/ICreateNewProjectDto';
import { ProjectsRepository } from '../../../dal/drydock/projects/ProjectsRepository';
import { VesselsRepository } from '../../../dal/drydock/vessels/VesselsRepository';
import { Command } from '../core/cqrs/Command';
import { UnitOfWork } from '../core/uof/UnitOfWork';

enum ProjectStates {
    Specification = 1,

    YardSelection = 2,

    Report = 3,
}

export class CreateProjectCommand extends Command<Request, void> {
    projectsRepository: ProjectsRepository;
    projectsService: ProjectService;
    vesselsRepository: VesselsRepository;
    uow: UnitOfWork;

    constructor() {
        super();

        this.projectsRepository = new ProjectsRepository();
        this.vesselsRepository = new VesselsRepository();
        this.projectsService = new ProjectService();
        this.uow = new UnitOfWork();
    }

    protected async ValidationHandlerAsync(request: Request): Promise<void> {
        if (!request) {
            throw new Error('Request is null');
        }
        const createProjectDto: CreateProjectDto = plainToClass(CreateProjectDto, request.body);
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
        const createProjectDto: CreateProjectDto = request.body as CreateProjectDto;

        createProjectDto.CreatedAtOffice = await this.projectsService.IsOffice();

        createProjectDto.ProjectStateId = ProjectStates.Specification;

        const vessel: LibVesselsEntity = await this.vesselsRepository.GetVessel(createProjectDto.VesselId);

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
    }
}
