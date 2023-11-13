import { Column, Entity } from "typeorm";

@Entity('specification_requisitions', { schema: 'dry_dock' })
export class SpecificationRequisitionsEntity {
    @Column('uniqueidentifier', {
        nullable: false,
        name: 'specification_uid',
        primary: true,
    })
    specification_uid: string;

    @Column('uniqueidentifier', {
        nullable: false,
        name: 'requisition_uid',
        primary: true,
    })
    requisition_uid: string;
}
