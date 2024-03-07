import { ProjectTemplateStandardJobEntity } from '../../../../entity/drydock/ProjectTemplate/ProjectTemplateStandardJobEntity';

export interface IStandardJobsToUpdateDto {
    standardJobsToRemove: ProjectTemplateStandardJobEntity[];
    standardJobsUidsToAdd: string[];
}
