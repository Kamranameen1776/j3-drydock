/* eslint-disable @typescript-eslint/naming-convention */
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { StandardJobs } from '../';

@Entity('tm_dd_lib_done_by', { schema: 'dbo' })
export class TmDdLibDoneBy {
    @PrimaryGeneratedColumn('uuid')
    uid: string;

    @Column('varchar', {
        nullable: false,
        name: 'done_by',
        length: 250,
    })
    done_by: string;

    @Column('varchar', {
        nullable: false,
        name: 'displayName',
        length: 250,
    })
    displayName: string;

    @Column('bit', {
        nullable: false,
        name: 'active_status',
    })
    active_status: boolean;

    @OneToMany(() => StandardJobs, (standardJob) => standardJob.doneBy)
    standard_jobs: StandardJobs[];
}
