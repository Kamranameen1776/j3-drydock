import { Column, Entity, Index } from 'typeorm';

@Index('PK_j3_prc_po_uid', ['uid'], { unique: true })
@Entity('j3_prc_po', { schema: 'prc' })
export class J3PrcPo {
    @Column('uniqueidentifier', { primary: true, name: 'uid' })
    uid: string;

    @Column('uniqueidentifier', { name: 'rfq_uid', nullable: false })
    rfqUid: string | null;

    @Column('varchar', { name: 'requisition_number', nullable: true, length: 50 })
    requisitionNumber: string | null;

    @Column('uniqueidentifier', { name: 'po_status_uid', nullable: true })
    poStatusUid: string | null;

    @Column('varchar', { name: 'po_number', nullable: false, length: 50 })
    poNumber: string | null;

    @Column('uniqueidentifier', { name: 'supplier_uid', nullable: true })
    supplierUid: string | null;

    @Column('varchar', { name: 'labels', nullable: true, length: 2000 })
    labels: string | null;

    @Column('varchar', { name: 'counts', nullable: true, length: 2000 })
    counts: string | null;

    @Column('bit', {
        name: 'active_status',
        nullable: true,
        default: () => '(1)',
    })
    activeStatus: boolean | null;

    @Column('datetimeoffset', {
        name: 'timestamp',
        nullable: true,
        default: () => 'getutcdate()()',
    })
    timestamp: Date | null;

    @Column('varchar', { name: 'activity', nullable: true, length: 300 })
    activity: string | null;

    @Column('uniqueidentifier', { name: 'requisition_uid', nullable: true })
    requisitionUid: string | null;

    @Column('varchar', { name: 'description', nullable: true, length: 2000 })
    description: string | null;

    @Column('datetimeoffset', { name: 'po_date', nullable: true })
    poDate: Date | null;

    @Column('datetimeoffset', { name: 'ready_date', nullable: true })
    readyDate: Date | null;

    @Column('float', {
        name: 'total_value',
        nullable: true,
    })
    totalValue: number | null;

    @Column('uniqueidentifier', { name: 'assignee_uid', nullable: true })
    assigneeUid: string | null;

    @Column('bit', { name: 'ihm', nullable: true, default: () => '(0)' })
    ihm: boolean | null;

    @Column('bit', { name: 'dg', nullable: true, default: () => '(0)' })
    dg: boolean | null;

    @Column('uniqueidentifier', { name: 'urgency_uid', nullable: true })
    urgencyUid: string | null;

    @Column('int', { name: 'delivery_port_id', nullable: true })
    deliveryPortId: number | null;

    @Column('datetimeoffset', { name: 'delivery_date', nullable: true })
    deliveryDate: Date | null;

    @Column('uniqueidentifier', { name: 'fleet_uid', nullable: true })
    fleetUid: string | null;

    @Column('uniqueidentifier', { name: 'po_type_uid', nullable: true })
    poTypeUid: string | null;

    @Column('uniqueidentifier', { name: 'vessel_uid', nullable: true })
    vesselUid: string | null;

    @Column('uniqueidentifier', { name: 'client_uid', nullable: true })
    clientUid: string | null;

    @Column('varchar', { name: 'issued_by_id', nullable: true, length: 50 })
    issuedById: string | null;

    @Column('varchar', { name: 'purchaser', nullable: true, length: 2000 })
    purchaser: string | null;

    @Column('varchar', { name: 'vessel_info', nullable: true, length: 2000 })
    vesselInfo: string | null;

    @Column('int', { name: 'vessel_id', nullable: true })
    vesselId: number | null;

    @Column('bit', {
        name: 'send_to_supplier',
        nullable: true,
        default: () => '(0)',
    })
    sendToSupplier: boolean | null;
}
