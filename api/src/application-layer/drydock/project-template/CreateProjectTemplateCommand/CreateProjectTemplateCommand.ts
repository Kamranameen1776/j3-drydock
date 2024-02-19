import { ApplicationException } from '../../../../bll/drydock/core/exceptions';
import { ProjectTemplateRepository } from '../../../../dal/drydock/ProjectTemplate/ProjectTemplateRepository';
import { ProjectTemplateStandardJobRepository } from '../../../../dal/drydock/ProjectTemplate/ProjectTemplateStandardJobRepository';
import { StandardJobsRepository } from '../../../../dal/drydock/standard-jobs/StandardJobsRepository';
import { ProjectTemplateEntity } from '../../../../entity/drydock/ProjectTemplate/ProjectTemplateEntity';
import { ProjectTemplateStandardJobEntity } from '../../../../entity/drydock/ProjectTemplate/ProjectTemplateStandardJobEntity';
import { diffArray } from '../../../../shared/utils/diff';
import { Command } from '../../core/cqrs/Command';
import { UnitOfWork } from '../../core/uof/UnitOfWork';
import { CreateProjectTemplateModel } from './CreateProjectTemplateModel';

export class CreateProjectTemplateCommand extends Command<CreateProjectTemplateModel, string> {
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
    protected async MainHandlerAsync(request: CreateProjectTemplateModel): Promise<string> {
        const projectTemplate = new ProjectTemplateEntity();
        projectTemplate.Subject = request.Subject;
        projectTemplate.Description = request.Description;
        projectTemplate.ProjectTypeUid = request.ProjectTypeUid;
        projectTemplate.created_at = request.CreatedAt;
        projectTemplate.created_by = request.CreatedBy;

        if (request.ProjectTemplateUid) {
            projectTemplate.uid = request.ProjectTemplateUid;
        }

        return this.uow.ExecuteAsync(async (queryRunner) => {
            const projectTemplateUid = await this.projectTemplateRepository.CreateProjectTemplate(
                projectTemplate,
                queryRunner,
            );

            if (request.VesselTypeUid?.length) {
                await this.projectTemplateRepository.updateProjectTemplateVesselTypes(
                    projectTemplateUid,
                    request.VesselTypeUid,
                    request.CreatedBy,
                    queryRunner,
                );
            }

            const StandardJobsIds = await this.standardJobsRepository.exists(request.StandardJobs);

            if (StandardJobsIds.length < request.StandardJobs.length) {
                throw new ApplicationException(
                    `Standard jobs is not found: ${diffArray(request.StandardJobs, StandardJobsIds)}`,
                );
            }

            const standardJobsOps = request.StandardJobs.map((uid) => {
                const projectTemplateStandardJob = new ProjectTemplateStandardJobEntity();
                projectTemplateStandardJob.StandardJobUid = uid;
                projectTemplateStandardJob.ProjectTemplateUid = projectTemplate.uid;
                projectTemplateStandardJob.timestamp = new Date();
                projectTemplateStandardJob.modified_by = request.CreatedBy;

                return projectTemplateStandardJob;
            });

            await this.projectTemplateStandardJobRepository.CreateOrUpdateProjectTemplateStandardJobs(
                standardJobsOps,
                queryRunner,
            );

            return projectTemplateUid;
        });
    }
}
