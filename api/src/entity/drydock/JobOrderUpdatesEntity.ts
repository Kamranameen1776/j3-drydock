import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('job_order_updates', { schema: 'dry_dock' })
export class JobOrderUpdatesEntity {
    @PrimaryGeneratedColumn('uuid')
    uid: string;

    @Column('uuid', {
        nullable: false,
        name: 'job_order_uid',
    })
    JobOrderUid: string;

    @Column('uuid', {
        nullable: false,
        name: 'updated_by_uid',
    })
    UpdatedByUid: string;

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
