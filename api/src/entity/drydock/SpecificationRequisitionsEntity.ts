import { Column, Entity, Unique } from 'typeorm';

@Entity('specification_requisitions', { schema: 'dry_dock' })
@Unique('UC_SPECIFICATION_REQUISITIONS', ['specificationUid', 'requisitionUid'])
export class SpecificationRequisitionsEntity {
    @Column('uniqueidentifier', {
        nullable: false,
        name: 'uid',
        primary: true,
    })
    uid: string;

    @Column('uniqueidentifier', {
        nullable: false,
        name: 'specification_uid',
    })
    specificationUid: string;

    @Column('uniqueidentifier', {
        nullable: false,
        name: 'requisition_uid',
    })
    requisitionUid: string;

    @Column('bit', {
        nullable: true,
        name: 'active_status',
        default: 1,
    })
    activeStatus: boolean;
}
