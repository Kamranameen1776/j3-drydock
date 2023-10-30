import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, RelationId } from "typeorm";

import { standard_jobs } from './standard_jobs';

@Entity('standard_jobs_sub_items', { schema: 'drydock' })
export class standard_jobs_sub_items {
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

    @Column('bit', {
        nullable: true,
        name: 'active_status',
    })
    active_status: boolean;

    @Column('uuid', {
        nullable: true,
        name: 'created_by',
    })
    created_by: string;

    @Column('datetime', {
        nullable: true,
        name: 'created_at',
    })
    created_at: Date;

    @Column('uuid', {
        nullable: true,
        name: 'updated_by',
    })
    updated_by: string;

    @Column('datetime', {
        nullable: true,
        name: 'updated_at',
    })
    updated_at: Date;

    @Column('uuid', {
        nullable: true,
        name: 'deleted_by',
    })
    deleted_by: string;

    @Column('datetime', {
        nullable: true,
        name: 'deleted_at',
    })
    deleted_at: Date;
}
