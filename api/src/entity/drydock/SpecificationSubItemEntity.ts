import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('specification_details_j3_sub_items_agg_job', { schema: 'dry_dock' })
export class SpecificationSubItemEntity {
    @PrimaryGeneratedColumn('uuid')
    uid: string;

    @Column('uniqueidentifier', {
        nullable: true,
        name: 'specification_uid',
    })
    SpecificationUid: string;

    @Column('nvarchar', {
        nullable: true,
        name: 'j3_prc_item_subject',
    })
    Subject: string;

    @Column('nvarchar', {
        nullable: true,
        name: 'j3_prc_uom',
    })
    unitUid: string;

    @Column('decimal', {
        nullable: true,
        name: 'quantity',
        precision: 18,
        scale: 2,
    })
    quantity: number;

    @Column('uniqueidentifier', {
        nullable: false,
        name: 'j3_prc_item_uid',
    })
    PrcCatalogItemId: string;

    @Column('uniqueidentifier', {
        nullable: false,
        name: 'j3_prc_job_uid',
    })
    PrcCatalogJobId: string;
}
