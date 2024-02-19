import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { RelationshipTableEntity } from '../../relationshipTableEntity';
import { StandardJobs } from '../StandardJobsEntity';
import { ProjectTemplateEntity } from './ProjectTemplateEntity';

export const ProjectTemplateStandardJobEntityTableName = 'project_template_standard_job';

@Entity(ProjectTemplateStandardJobEntityTableName, { schema: 'dry_dock' })
export class ProjectTemplateStandardJobEntity extends RelationshipTableEntity {
    @PrimaryColumn('uuid', {
        nullable: false,
        name: 'project_template_uid',
    })
    ProjectTemplateUid: string;

    @PrimaryColumn('uuid', {
        nullable: false,
        name: 'standard_job_uid',
    })
    StandardJobUid: string;

    @ManyToOne(() => ProjectTemplateEntity, (entity) => entity.ProjectTemplateStandardJobs)
    @JoinColumn({
        name: 'project_template_uid',
        referencedColumnName: 'uid',
    })
    ProjectTemplate: ProjectTemplateEntity;

    @ManyToOne(() => StandardJobs, (entity) => entity.ProjectTemplateStandardJobs)
    @JoinColumn({
        name: 'standard_job_uid',
        referencedColumnName: 'uid',
    })
    StandardJob: StandardJobs;
}
