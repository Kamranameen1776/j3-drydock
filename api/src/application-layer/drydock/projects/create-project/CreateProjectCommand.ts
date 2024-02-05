import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { SynchronizerService } from 'j2utils';

import { CreateProjectDto } from '../../../../bll/drydock/projects/dtos/ICreateProjectDto';
import { ProjectService } from '../../../../bll/drydock/projects/ProjectService';
import { getTableName } from '../../../../common/drydock/ts-helpers/tableName';
import { ICreateNewProjectDto } from '../../../../dal/drydock/projects/dtos/ICreateNewProjectDto';
import { IProjectsForMainPageRecordDto } from '../../../../dal/drydock/projects/dtos/IProjectsForMainPageRecordDto';
import { ProjectsRepository } from '../../../../dal/drydock/projects/ProjectsRepository';
import { VesselsRepository } from '../../../../dal/drydock/vessels/VesselsRepository';
import { LibVesselsEntity } from '../../../../entity/drydock/dbo/LibVesselsEntity';
import { ProjectEntity } from '../../../../entity/drydock/ProjectEntity';
import { Command } from '../../core/cqrs/Command';
import { UnitOfWork } from '../../core/uof/UnitOfWork';
import { CreateProjectDataDto } from './CreateProjectDataDto';

enum ProjectStates {
    Specification = 1,

    YardSelection = 2,

    Report = 3,
}

export class CreateProjectCommand extends Command<CreateProjectDataDto, IProjectsForMainPageRecordDto[]> {
    projectsRepository: ProjectsRepository;
    projectsService: ProjectService;
    vesselsRepository: VesselsRepository;
    uow: UnitOfWork;

    tableName = getTableName(ProjectEntity);
    constructor() {
        super();

        this.projectsRepository = new ProjectsRepository();
        this.vesselsRepository = new VesselsRepository();
        this.projectsService = new ProjectService();
        this.uow = new UnitOfWork();
    }

    protected async ValidationHandlerAsync(request: CreateProjectDataDto): Promise<void> {
        if (!request) {
            throw new Error('Request is null');
        }
        const createProjectDto: CreateProjectDto = plainToClass(CreateProjectDto, request.ProjectDto);

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
    protected async MainHandlerAsync(request: CreateProjectDataDto): Promise<IProjectsForMainPageRecordDto[]> {
        const token: string = request.Token;
        const createProjectDto: CreateProjectDto = request.ProjectDto;

        createProjectDto.CreatedAtOffice = await this.projectsService.IsOffice();

        createProjectDto.ProjectStateId = ProjectStates.Specification;

        const vessel: LibVesselsEntity = await this.vesselsRepository.GetVessel(createProjectDto.VesselId);

        const taskManagerData = await this.projectsService.TaskManagerIntegration(createProjectDto, vessel, token);

        createProjectDto.TaskManagerUid = taskManagerData.uid;

        const newProjectDto: ICreateNewProjectDto = {
            uid: createProjectDto.uid,
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

        const result = await this.uow.ExecuteAsync(async (queryRunner) => {
            const projectId = await this.projectsRepository.CreateProject(newProjectDto, queryRunner);
            await SynchronizerService.dataSynchronizeManager(
                queryRunner.manager,
                this.tableName,
                'uid',
                projectId,
                vessel.VesselId,
            );
            return projectId;
        });

        return this.projectsRepository.GetProject(result);
    }
}
