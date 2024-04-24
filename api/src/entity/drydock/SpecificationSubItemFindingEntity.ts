import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('specification_sub_item_finding', { schema: 'dry_dock' })
export class SpecificationSubItemFindingEntity {
    @PrimaryGeneratedColumn('uuid')
    uid: string;

    @Column('uniqueidentifier', {
        nullable: false,
        name: 'specification_sub_item_uid',
    })
    SubItemUid: string;

    @Column('uniqueidentifier', {
        nullable: false,
        name: 'finding_uid',
    })
    FindingUid: string;

    @Column('bit', {
        nullable: false,
        name: 'active_status',
        default: true,
    })
    ActiveStatus: boolean;
}
