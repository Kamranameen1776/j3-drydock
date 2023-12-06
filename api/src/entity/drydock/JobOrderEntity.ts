import { JobOrderStatus } from 'dal/drydock/projects/job-orders/JobOrderStatus';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('job_order', { schema: 'dry_dock' })
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

    @Column('varchar', {
        nullable: true,
        name: 'remark',
        length: 2000,
    })
    Remark: string;

    @Column('varchar', {
        nullable: true,
        name: 'remark',
        length: 50,
    })
    Status: JobOrderStatus;

    @Column('int', {
        nullable: false,
        name: 'progress',
    })
    Progress: number;

    @Column('datetime2', {
        nullable: false,
        name: 'created_at',
    })
    CreatedAt: Date;

    @Column('bit', {
        nullable: false,
        name: 'active_status',
    })
    ActiveStatus: boolean;
}
