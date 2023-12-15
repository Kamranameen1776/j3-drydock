import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('specification_details_j3_pms_agg_job', { schema: 'dry_dock' })
export class SpecificationPmsEntity {
    @PrimaryGeneratedColumn('uuid')
    uid: string;

    @Column('uniqueidentifier', {
        nullable: true,
        name: 'specification_uid',
    })
    SpecificationUid: string;

    @Column('uniqueidentifier', {
        nullable: false,
        name: 'j3_pms_agg_job_uid',
    })
    // eslint-disable-next-line @typescript-eslint/naming-convention
    PMSUid: string;

    @Column('bit', {
        nullable: false,
        name: 'active_status',
        default: true,
    })
    ActiveStatus: boolean;
}
