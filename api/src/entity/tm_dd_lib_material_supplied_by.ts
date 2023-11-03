import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { standard_jobs } from './standard_jobs';

@Entity('tm_dd_lib_material_supplied_by', { schema: 'dbo' })
export class tm_dd_lib_material_supplied_by {
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

    @OneToMany(() => standard_jobs, (standardJob) => standardJob.material_supplied_by)
    standard_jobs: standard_jobs[];
}
