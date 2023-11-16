import { Column, Entity } from 'typeorm';

@Entity('specification_requisitions', { schema: 'dry_dock' })
export class SpecificationRequisitionsEntity {
    @Column('uniqueidentifier', {
        nullable: false,
        name: 'specification_uid',
        primary: true,
    })
    specificationUid: string;

    @Column('uniqueidentifier', {
        nullable: false,
        name: 'requisition_uid',
        primary: true,
    })
    requisitionUid: string;
}
