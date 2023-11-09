import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

import { standard_jobs } from './standard_jobs';

@Entity('LIB_VESSELTYPES', { schema: 'dbo' })
export class LIB_VESSELTYPES {
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

    @ManyToMany(() => standard_jobs, (standardJob) => standardJob.vessel_type)
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
    standard_jobs: standard_jobs[];
}
