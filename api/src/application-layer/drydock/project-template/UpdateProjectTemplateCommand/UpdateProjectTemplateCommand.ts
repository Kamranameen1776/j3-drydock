import { ApplicationException } from '../../../../bll/drydock/core/exceptions';
import { ProjectTemplateRepository } from '../../../../dal/drydock/ProjectTemplate/ProjectTemplateRepository';
import { ProjectTemplateStandardJobRepository } from '../../../../dal/drydock/ProjectTemplate/ProjectTemplateStandardJobRepository';
import { StandardJobsRepository } from '../../../../dal/drydock/standard-jobs/StandardJobsRepository';
import { ProjectTemplateStandardJobEntity } from '../../../../entity/drydock/ProjectTemplate/ProjectTemplateStandardJobEntity';
import { diffArray } from '../../../../shared/utils/diff';
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
            throw new ApplicationException(`Project template is not found: ${request.ProjectTemplateUid}`);
        }

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

            if (request.VesselTypeUid) {
                await this.projectTemplateRepository.updateProjectTemplateVesselTypes(
                    request.ProjectTemplateUid,
                    request.VesselTypeUid,
                    request.UpdatedBy,
                    queryRunner,
                );
            }

            const { standardJobsToRemove, standardJobsUidsToAdd } = await this.getStandardJobsToUpdate(
                request.StandardJobs,
                projectTemplateStandardJobs,
            );

            const StandardJobsIds = await this.standardJobsRepository.exists(standardJobsUidsToAdd);

            if (StandardJobsIds.length < standardJobsUidsToAdd.length) {
                throw new ApplicationException(
                    `Standard jobs is not found: ${diffArray(standardJobsUidsToAdd, StandardJobsIds)}`,
                );
            }

            const standardJobsOps = standardJobsUidsToAdd
                .map((uid) => {
                    const projectTemplateStandardJob = new ProjectTemplateStandardJobEntity();
                    projectTemplateStandardJob.StandardJobUid = uid;
                    projectTemplateStandardJob.ProjectTemplateUid = projectTemplate.uid;
                    projectTemplateStandardJob.timestamp = new Date();
                    projectTemplateStandardJob.modified_by = request.UpdatedBy;

                    return projectTemplateStandardJob;
                })
                .concat(
                    standardJobsToRemove.map((standardJobToRemove) => {
                        standardJobToRemove.active_status = false;
                        standardJobToRemove.modified_by = request.UpdatedBy;
                        standardJobToRemove.timestamp = new Date();

                        return standardJobToRemove;
                    }),
                );

            await this.projectTemplateStandardJobRepository.CreateOrUpdateProjectTemplateStandardJobs(
                standardJobsOps,
                queryRunner,
            );
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
