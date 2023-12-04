/* eslint-disable @typescript-eslint/naming-convention */
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { StandardJobs } from '../';

@Entity('tm_dd_lib_material_supplied_by', { schema: 'dbo' })
export class TmDdLibMaterialSuppliedBy {
    @PrimaryGeneratedColumn('uuid')
    uid: string;

    @Column('varchar', {
        nullable: false,
        name: 'materialSuppliedBy',
        length: 250,
    })
    materialSuppliedBy: string;

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

    @OneToMany(() => StandardJobs, (standardJob) => standardJob.materialSuppliedBy)
    standard_jobs: StandardJobs[];
}
