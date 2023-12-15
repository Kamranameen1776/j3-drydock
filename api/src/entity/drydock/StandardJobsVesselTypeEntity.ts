/* eslint-disable @typescript-eslint/naming-convention */
import { Column, Entity } from 'typeorm';

@Entity('standard_jobs_vessel_type', { schema: 'dry_dock' })
export class StandardJobsVesselTypeEntity {
    @Column('int', {
        nullable: false,
        name: 'vessel_type_id',
        primary: true,
    })
    vessel_type_id: number;

    @Column('uniqueidentifier', {
        nullable: false,
        name: 'standard_job_uid',
        primary: true,
    })
    standard_job_uid: string;
}
