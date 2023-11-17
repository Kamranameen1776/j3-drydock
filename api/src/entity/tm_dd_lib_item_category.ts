import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { StandardJobs } from './standard_jobs';

@Entity('tm_dd_lib_item_category', { schema: 'dbo' })
export class TmDdLibItemCategory {
    @PrimaryGeneratedColumn('uuid')
    uid: string;

    @Column('varchar', {
        nullable: false,
        name: 'item_category',
        length: 250,
    })
    item_category: string;

    @Column('varchar', {
        nullable: false,
        name: 'display_name',
        length: 250,
    })
    display_name: string;

    @Column('bit', {
        nullable: false,
        name: 'active_status',
    })
    active_status: boolean;

    @OneToMany(() => StandardJobs, (standardJob) => standardJob.material_supplied_by)
    standard_jobs: StandardJobs[];
}
