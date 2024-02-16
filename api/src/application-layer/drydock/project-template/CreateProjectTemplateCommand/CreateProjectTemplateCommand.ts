import { ApplicationException } from '../../../../bll/drydock/core/exceptions';
import { ProjectTemplateRepository } from '../../../../dal/drydock/ProjectTemplate/ProjectTemplateRepository';
import { ProjectTemplateStandardJobRepository } from '../../../../dal/drydock/ProjectTemplate/ProjectTemplateStandardJobRepository';
import { StandardJobsRepository } from '../../../../dal/drydock/standard-jobs/StandardJobsRepository';
import { ProjectTemplateEntity } from '../../../../entity/drydock/ProjectTemplate/ProjectTemplateEntity';
import { ProjectTemplateStandardJobEntity } from '../../../../entity/drydock/ProjectTemplate/ProjectTemplateStandardJobEntity';
import { Command } from '../../core/cqrs/Command';
import { UnitOfWork } from '../../core/uof/UnitOfWork';
import { CreateProjectTemplateModel } from './CreateProjectTemplateModel';

export class CreateProjectTemplateCommand extends Command<CreateProjectTemplateModel, void> {
    projectTemplateRepository: ProjectTemplateRepository;
    projectTemplateStandardJobRepository: ProjectTemplateStandardJobRepository;
    standardJobsRepository: StandardJobsRepository;
    uow: UnitOfWork;

    constructor() {
        super();

        this.projectTemplateRepository = new ProjectTemplateRepository();
        this.projectTemplateStandardJobRepository = new ProjectTemplateStandardJobRepository();
        this.standardJobsRepository = new StandardJobsRepository();
        this.uow = new UnitOfWork();
    }

    /**
     * Create project templates
     */
    protected async MainHandlerAsync(request: CreateProjectTemplateModel): Promise<void> {
        // TODO: 1. validate vessel type

        // var vesselType = await this.someRepo.GetVesselType(request.VesselTypeUid)
        //     ?? throw new ApplicationException("Vessel type not found: " + request.VesselTypeUid);

        // TODO: 2. validate request.ProjectTypeUid

        const projectTemplate = new ProjectTemplateEntity();
        projectTemplate.Subject = request.Subject;
        projectTemplate.Description = request.Description;
        projectTemplate.ProjectTypeUid = request.ProjectTypeUid;
        projectTemplate.created_at = request.CreatedAt;
        projectTemplate.created_by = request.CreatedBy;

        if (request.ProjectTemplateUid) {
            projectTemplate.uid = request.ProjectTemplateUid;
        }

        await this.uow.ExecuteAsync(async (queryRunner) => {
            const projectTemplateUid = await this.projectTemplateRepository.CreateProjectTemplate(
                projectTemplate,
                queryRunner,
            );

            if (request.VesselTypeUid?.length) {
                await this.projectTemplateRepository.updateProjectTemplateVesselTypes(
                    projectTemplateUid,
                    request.VesselTypeUid,
                    queryRunner,
                );
            }

            for (const standardJobUid of request.StandardJobs) {
                const isStandardJobExists = await this.standardJobsRepository.Exists(standardJobUid);

                if (!isStandardJobExists) {
                    throw new ApplicationException(`Standard job is not found: ${standardJobUid}`);
                }

                const projectTemplateStandardJob = new ProjectTemplateStandardJobEntity();
                projectTemplateStandardJob.StandardJobUid = standardJobUid;
                projectTemplateStandardJob.ProjectTemplateUid = projectTemplateUid;
                projectTemplateStandardJob.CreatedAt = request.CreatedAt;

                await this.projectTemplateStandardJobRepository.CreateProjectTemplateStandardJobs(
                    projectTemplateStandardJob,
                    queryRunner,
                );
            }

            // TODO: add synchronization with vessel/office
        });
    }
}
