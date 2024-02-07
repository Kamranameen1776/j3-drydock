import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { JobOrderStatus } from '../../dal/drydock/projects/job-orders/JobOrderStatus';

@Entity('job_orders', { schema: 'dry_dock' })
export class JobOrderEntity {
    @PrimaryGeneratedColumn('uuid')
    uid: string;

    @Column('uuid', {
        nullable: false,
        name: 'project_uid',
    })
    ProjectUid: string;

    @Column('uuid', {
        nullable: false,
        name: 'specification_uid',
    })
    SpecificationUid: string;

    @Column('varchar', {
        nullable: false,
        name: 'subject',
        length: 200,
    })
    Subject: string;

    @Column('nvarchar', {
        nullable: true,
        name: 'remarks',
        length: 'max',
    })
    Remarks: string;

    @Column('varchar', {
        nullable: true,
        name: 'status',
        length: 50,
    })
    Status: JobOrderStatus;

    @Column('int', {
        nullable: false,
        name: 'progress',
    })
    Progress: number;

    @Column('datetimeoffset', {
        nullable: false,
        name: 'last_updated',
    })
    LastUpdated: Date;

    @Column('datetimeoffset', {
        nullable: false,
        name: 'created_at',
        default: () => 'getutcdate()()',
    })
    CreatedAt: Date | null;

    @Column('uuid', {
        nullable: false,
        name: 'created_by',
    })
    CreatedBy: string;

    @Column('bit', {
        nullable: false,
        name: 'active_status',
    })
    ActiveStatus: boolean;
}
