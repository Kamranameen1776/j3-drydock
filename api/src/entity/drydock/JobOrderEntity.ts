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
        name: 'date',
    })
    DateAndTime: Date;

    @Column('bit', {
        nullable: false,
        name: 'active_status',
    })
    ActiveStatus: boolean;
}
