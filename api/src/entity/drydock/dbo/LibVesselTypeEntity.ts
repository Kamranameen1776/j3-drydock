/* eslint-disable @typescript-eslint/naming-convention */
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

import { StandardJobs } from '../';
import { ProjectTemplateEntity } from '../ProjectTemplate/ProjectTemplateEntity';

@Entity('LIB_VESSELTYPES', { schema: 'dbo' })
export class LibVesseltypes {
    @PrimaryGeneratedColumn()
    ID: number;

    @Column('uniqueidentifier', {
        nullable: false,
        name: 'uid',
    })
    uid: string;

    @Column('varchar', {
        nullable: false,
        name: 'VesselTypes',
        length: 250,
    })
    VesselTypes: string;

    @Column('bit', {
        nullable: false,
        name: 'Active_Status',
    })
    Active_Status: string;

    @ManyToMany(() => StandardJobs, (standardJob) => standardJob.vesselType)
    @JoinTable({
        name: 'standard_jobs_vessel_type',
        schema: 'dry_dock',
        joinColumn: {
            name: 'vessel_type_id',
            referencedColumnName: 'ID',
        },
        inverseJoinColumn: {
            name: 'standard_job_uid',
            referencedColumnName: 'uid',
        },
    })
    standard_jobs: StandardJobs[];

    @ManyToMany(() => ProjectTemplateEntity, (projectTemplate: ProjectTemplateEntity) => projectTemplate.vesselType)
    @JoinTable({
        name: 'project_template_vessel_type',
        schema: 'dry_dock',
        inverseJoinColumn: {
            name: 'project_template_uid',
            referencedColumnName: 'uid',
        },
        joinColumn: {
            name: 'vessel_type_id',
            referencedColumnName: 'ID',
        },
    })
    project_templates: ProjectTemplateEntity[];
}
