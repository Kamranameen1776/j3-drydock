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

    @Column('uuid', {
        nullable: false,
        name: 'responsible_uid',
    })
    ResponsibleUid: string;

    @Column('varchar', {
        nullable: false,
        name: 'last_updated',
    })
    LastUpdated: Date;

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

    @Column('decimal', {
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
