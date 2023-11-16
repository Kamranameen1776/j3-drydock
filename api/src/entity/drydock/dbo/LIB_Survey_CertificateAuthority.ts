import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

import { StandardJobs } from '../standard_jobs';

@Entity('LIB_Survey_CertificateAuthority', { schema: 'dbo' })
export class LibSurveyCertificateAuthority {
    @PrimaryGeneratedColumn()
    ID: number;

    @Column('varchar', {
        nullable: false,
        name: 'Authority',
        length: 250,
    })
    Authority: string;

    @Column('bit', {
        nullable: false,
        name: 'Active_Status',
    })
    Active_Status: boolean;

    @ManyToMany(() => StandardJobs, (standardJob) => standardJob.inspection)
    @JoinTable({
        name: 'standard_jobs_survey_certificate_authority',
        schema: 'dry_dock',
        joinColumn: {
            name: 'survey_id',
            referencedColumnName: 'ID',
        },
        inverseJoinColumn: {
            name: 'standard_job_uid',
            referencedColumnName: 'uid',
        },
    })
    standard_jobs: StandardJobs[];
}
