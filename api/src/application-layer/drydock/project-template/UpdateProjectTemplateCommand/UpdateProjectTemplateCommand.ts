import { ApplicationException } from '../../../../bll/drydock/core/exceptions';
import { ProjectTemplateRepository } from '../../../../dal/drydock/ProjectTemplate/ProjectTemplateRepository';
import { ProjectTemplateStandardJobRepository } from '../../../../dal/drydock/ProjectTemplate/ProjectTemplateStandardJobRepository';
import { StandardJobsRepository } from '../../../../dal/drydock/standard-jobs/StandardJobsRepository';
import { ProjectTemplateStandardJobEntity } from '../../../../entity/drydock/ProjectTemplate/ProjectTemplateStandardJobEntity';
import { Command } from '../../core/cqrs/Command';
import { UnitOfWork } from '../../core/uof/UnitOfWork';
import { IStandardJobsToUpdateDto } from './IStandardJobsToUpdateDto';
import { UpdateProjectTemplateModel } from './UpdateProjectTemplateModel';

export class UpdateProjectTemplateCommand extends Command<UpdateProjectTemplateModel, void> {
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
     * Update project templates
     */
    protected async MainHandlerAsync(request: UpdateProjectTemplateModel): Promise<void> {
        const projectTemplate = await this.projectTemplateRepository.TryGetProjectTemplateByUid(
            request.ProjectTemplateUid,
        );

        if (!projectTemplate) {
            throw new ApplicationException('Project template is not found: ' + request.ProjectTemplateUid);
        }

        // TODO: 1. validate vessel type

        // var vesselType = await this.someRepo.GetVesselType(request.VesselTypeUid)
        //     ?? throw new ApplicationException("Vessel type not found: " + request.VesselTypeUid);

        // TODO: 2. validate request.ProjectTypeUid

        projectTemplate.Subject = request.Subject;
        projectTemplate.Description = request.Description;
        projectTemplate.ProjectTypeUid = request.ProjectTypeUid;
        projectTemplate.updated_at = request.LastUpdated;
        projectTemplate.updated_by = request.UpdatedBy;

        const projectTemplateStandardJobs =
            await this.projectTemplateStandardJobRepository.GetProjectTemplateStandardJobsByProjectTemplateUid(
                projectTemplate.uid,
            );

        await this.uow.ExecuteAsync(async (queryRunner) => {
            await this.projectTemplateRepository.UpdateProjectTemplate(projectTemplate, queryRunner);

            if (request.VesselTypeUid?.length) {
                await this.projectTemplateRepository.updateProjectTemplateVesselTypes(
                    request.ProjectTemplateUid,
                    request.VesselTypeUid,
                    queryRunner,
                );
            }

            const { standardJobsToRemove, standardJobsUidsToAdd } = await this.getStandardJobsToUpdate(
                request.StandardJobs,
                projectTemplateStandardJobs,
            );

            for (const standardJobUid of standardJobsUidsToAdd) {
                const isStandardJobExists = await this.standardJobsRepository.Exists(standardJobUid);

                if (!isStandardJobExists) {
                    throw new ApplicationException(`Standard job is not found: ${standardJobUid}`);
                }

                const projectTemplateStandardJob = new ProjectTemplateStandardJobEntity();
                projectTemplateStandardJob.StandardJobUid = standardJobUid;
                projectTemplateStandardJob.ProjectTemplateUid = projectTemplate.uid;
                projectTemplateStandardJob.CreatedAt = request.LastUpdated;

                await this.projectTemplateStandardJobRepository.CreateProjectTemplateStandardJobs(
                    projectTemplateStandardJob,
                    queryRunner,
                );
            }

            for (const standardJobToRemove of standardJobsToRemove) {
                standardJobToRemove.ActiveStatus = false;

                await this.projectTemplateStandardJobRepository.UpdateProjectTemplateStandardJobs(
                    standardJobToRemove,
                    queryRunner,
                );
            }

            // TODO: add synchronization with vessel/office
        });
    }

    private async getStandardJobsToUpdate(
        requestStandardJobUids: string[],
        projectTemplateStandardJobs: ProjectTemplateStandardJobEntity[],
    ): Promise<IStandardJobsToUpdateDto> {
        const standardJobsToRemove = [];
        const standardJobsUidsToAdd = requestStandardJobUids;

        for (const standardJob of projectTemplateStandardJobs) {
            const index = standardJobsUidsToAdd.indexOf(standardJob.StandardJobUid);

            if (index < 0) {
                standardJobsToRemove.push(standardJob);
            } else {
                standardJobsUidsToAdd.splice(index, 1);
            }
        }

        return {
            standardJobsToRemove,
            standardJobsUidsToAdd,
        };
    }
}
