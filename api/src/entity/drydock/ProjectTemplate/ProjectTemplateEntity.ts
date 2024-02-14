import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { LibVesseltypes } from '../dbo/LibVesselTypeEntity';
import { ProjectTemplateStandardJobEntity } from './ProjectTemplateStandardJobEntity';

export const ProjectTemplateEntityTableName = 'project_template';

@Entity(ProjectTemplateEntityTableName, { schema: 'dry_dock' })
export class ProjectTemplateEntity {
    @PrimaryGeneratedColumn('uuid')
    uid: string;

    @Column('int', {
        nullable: false,
        name: 'template_code',
        generated: 'increment',
    })
    TemplateCode: number;

    @Column('uuid', {
        nullable: false,
        name: 'project_type_uid',
    })
    ProjectTypeUid: string;

    @ManyToMany(() => LibVesseltypes, (LIB_VESSELTYPES: LibVesseltypes) => LIB_VESSELTYPES.project_templates)
    @JoinTable({
        name: 'project_template_vessel_type',
        schema: 'dry_dock',
        joinColumn: {
            name: 'project_template_uid',
            referencedColumnName: 'uid',
        },
        inverseJoinColumn: {
            name: 'vessel_type_id',
            referencedColumnName: 'ID',
        },
    })
    vesselType: Partial<LibVesseltypes>[];

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
    Description: string | null;

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
