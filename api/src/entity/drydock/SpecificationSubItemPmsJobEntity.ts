import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('specification_sub_item_j3_pms_agg_job', { schema: 'dry_dock' })
export class SpecificationSubItemPmsEntity {
    @PrimaryGeneratedColumn('uuid')
    uid: string;

    @Column('uniqueidentifier', {
        nullable: false,
        name: 'specification_sub_item_uid',
    })
    SubItemUid: string;

    @Column('uniqueidentifier', {
        nullable: false,
        name: 'j3_pms_agg_job_uid',
    })
    PmsJobUid: string;

    @Column('bit', {
        nullable: false,
        name: 'active_status',
        default: true,
    })
    ActiveStatus: boolean;
}
