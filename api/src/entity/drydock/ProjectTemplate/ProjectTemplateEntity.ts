import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { ProjectTemplateStandardJobEntity } from './ProjectTemplateStandardJobEntity';

@Entity('project_template', { schema: 'dry_dock' })
export class ProjectTemplateEntity {
    @PrimaryGeneratedColumn('uuid')
    uid: string;

    @Column('int', {
        nullable: false,
        name: 'template_code',
    })
    TemplateCode: number;

    @Column('uuid', {
        nullable: false,
        name: 'project_type_uid',
    })
    ProjectTypeUid: string;

    @Column('uuid', {
        nullable: true,
        name: 'vessel_type_uid',
    })
    VesselTypeUid: string;

    @Column('nvarchar', {
        nullable: false,
        name: 'subject',
        length: 200,
    })
    Subject: string;

    @Column('nvarchar', {
        nullable: true,
        name: 'description',
        length: 'max',
    })
    Description: string;

    @Column('datetimeoffset', {
        nullable: false,
        name: 'last_updated',
    })
    LastUpdated: Date;

    @Column('datetimeoffset', {
        nullable: false,
        name: 'created_at',
    })
    CreatedAt: Date | null;

    @Column('bit', {
        nullable: false,
        name: 'active_status',
    })
    ActiveStatus: boolean;

    @OneToMany(() => ProjectTemplateStandardJobEntity, (entity) => entity.ProjectTemplate)
    ProjectTemplateStandardJobs: ProjectTemplateStandardJobEntity[];
}
