import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';

import { BaseDatesEntity } from './baseDatesEntity';
import { standard_jobs } from './standard_jobs';

@Entity('standard_jobs_sub_items', { schema: 'dry_dock' })
export class standard_jobs_sub_items extends BaseDatesEntity {
    @PrimaryGeneratedColumn('uuid')
    uid: string;

    @Column('varchar', {
        nullable: false,
        name: 'code',
        length: 250,
    })
    code: string;

    @Column('int', {
        nullable: false,
        generated: 'increment',
        name: 'number',
    })
    number: number;

    @Column('varchar', {
        nullable: false,
        name: 'subject',
        length: 500,
    })
    subject: string;

    @Column('varchar', {
        nullable: false,
        name: 'description',
        length: 5000,
    })
    description: string;

    @OneToOne(() => standard_jobs, (standardJob) => standardJob.sub_items)
    @JoinColumn({
        name: 'standard_job_uid',
    })
    standard_job: Partial<standard_jobs>;
    @RelationId((entity: standard_jobs_sub_items) => entity.standard_job)
    standard_job_uid: string;
}
