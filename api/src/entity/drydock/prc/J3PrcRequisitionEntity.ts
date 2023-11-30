import { Column, Entity, Index } from 'typeorm';

@Index('PK_j3_prc_requisition_uid', ['uid'], { unique: true })
@Entity('j3_prc_requisition', { schema: 'prc' })
export class J3PrcRequisition {
    @Column('uniqueidentifier', { primary: true, name: 'uid' })
    uid: string;

    @Column('bit', {
        name: 'active_status',
        nullable: true,
        default: () => '(1)',
    })
    activeStatus: boolean | null;

    @Column('varchar', { name: 'activity', nullable: true, length: 300 })
    activity: string | null;

    @Column('uniqueidentifier', {
        name: 'assignee_uid',
        nullable: true,
    })
    assigneeUid: string | null;

    @Column('datetimeoffset', { name: 'cancel_date', nullable: true })
    cancelDate: Date | null;

    @Column('uniqueidentifier', { name: 'client_uid', nullable: true })
    clientUid: string | null;

    @Column('varchar', { name: 'counts', nullable: true, length: 2000 })
    counts: string | null;

    @Column('datetimeoffset', {
        name: 'creation_date',
        nullable: true,
        default: () => 'getutcdate()()',
    })
    creationDate: Date | null;

    @Column('datetimeoffset', { name: 'delivery_date', nullable: true })
    deliveryDate: Date | null;

    @Column('int', { name: 'delivery_port_id', nullable: true })
    deliveryPortId: number | null;

    @Column('uniqueidentifier', {
        name: 'department_uid',
        nullable: true,
    })
    departmentUid: string | null;

    @Column('varchar', { name: 'description', nullable: true, length: 2000 })
    description: string | null;

    @Column('bit', { name: 'dg', nullable: true, default: () => '(0)' })
    dg: boolean | null;

    @Column('uniqueidentifier', { name: 'fleet_uid', nullable: true })
    fleetUid: string | null;

    @Column('bit', { name: 'ihm', nullable: true, default: () => '(0)' })
    ihm: boolean | null;

    @Column('varchar', { name: 'labels', nullable: true, length: 2000 })
    labels: string | null;

    @Column('bit', { name: 'no_quotation', nullable: true, default: () => '(0)' })
    noQuotation: boolean | null;

    @Column('uniqueidentifier', { name: 'po_type_uid', nullable: true })
    poTypeUid: string | null;

    @Column('varchar', {
        name: 'requisition_number',
        nullable: false,
        length: 50,
    })
    requisitionNumber: string | null;

    @Column('uniqueidentifier', { name: 'status_uid', nullable: true })
    statusUid: string | null;

    @Column('bit', { name: 'sync_status', nullable: true })
    syncStatus: boolean | null;

    @Column('char', { name: 'env_code', nullable: true, length: 1 })
    envCode: string | null;

    @Column('datetimeoffset', {
        name: 'timestamp',
        nullable: true,
        default: () => 'getutcdate()()',
    })
    timestamp: Date | null;

    @Column('uniqueidentifier', { name: 'urgency_uid', nullable: true })
    urgencyUid: string | null;

    @Column('int', { name: 'vessel_id', nullable: true })
    vesselId: number | null;

    @Column('varchar', { name: 'vessel_info', nullable: true, length: 2000 })
    vesselInfo: string | null;

    @Column('uniqueidentifier', { name: 'vessel_uid', nullable: true })
    vesselUid: string | null;

    @Column('datetimeoffset', {
        name: 'approval_date',
        nullable: true,
    })
    approvalDate: Date | null;
}
